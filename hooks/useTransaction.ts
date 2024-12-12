'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { TransactionStatus, monitorTransaction } from '@/lib/utils/transaction';
import { checkAllowance, approveToken } from '@/lib/utils/token';

export function useTransaction() {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const toast = useToast();

  const executeTransaction = useCallback(async (
    provider: ethers.providers.Web3Provider,
    tokenAddress: string | null,
    spenderAddress: string | null,
    amount: ethers.BigNumber | null,
    transaction: () => Promise<ethers.ContractTransaction>
  ) => {
    try {
      // Verifica e lida com a aprovação de tokens, se necessário
      if (tokenAddress && spenderAddress && amount) {
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        
        const allowance = await checkAllowance(
          provider,
          tokenAddress,
          signerAddress,
          spenderAddress
        );

        if (allowance.lt(amount)) {
          toast({
            title: 'Approval Required',
            description: 'Please approve token spending',
            status: 'info',
            duration: 5000,
          });

          const approved = await approveToken(
            provider,
            tokenAddress,
            spenderAddress,
            amount
          );

          if (!approved) {
            throw new Error('Token approval failed');
          }
        }
      }

      // Executa a transação principal
      const tx = await transaction();
      
      setStatus({
        status: 'pending',
        hash: tx.hash,
        confirmations: 0,
      });

      // Monitora o status da transação
      const finalStatus = await monitorTransaction(
        provider,
        tx.hash,
        (status) => {
          setStatus(status);
          if (status.status === 'confirmed') {
            toast({
              title: 'Transaction Confirmed',
              description: `Transaction confirmed with ${status.confirmations} confirmations`,
              status: 'success',
              duration: 5000,
            });
          }
        }
      );

      return finalStatus;
    } catch (error) {
      // Tratamento adequado para erros desconhecidos
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Transaction failed:', error);
      toast({
        title: 'Transaction Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      return null;
    }
  }, [toast]);

  return {
    status,
    executeTransaction,
  };
}
