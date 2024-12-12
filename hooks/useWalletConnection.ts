'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';

export function useWalletConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to use this dApp',
        status: 'error',
        duration: 5000,
      });
      return null;
    }

    try {
      setIsConnecting(true);

      // Instancia o provider e solicita acesso às contas
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      // Valida a rede conectada
      const targetChainId = 56; // Altere para o Chain ID da sua rede
      if (network.chainId !== targetChainId) {
        toast({
          title: 'Wrong Network',
          description: `Please connect to the correct network. Expected Chain ID: ${targetChainId}`,
          status: 'warning',
          duration: 5000,
        });
        return null;
      }

      // Exibe mensagem de sucesso
      toast({
        title: 'Wallet Connected',
        description: `Connected account: ${accounts[0]}`,
        status: 'success',
        duration: 5000,
      });

      return {
        provider,
        account: accounts[0],
        chainId: network.chainId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Connection Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  return { connectWallet, isConnecting };
}
