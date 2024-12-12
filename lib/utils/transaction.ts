'use client';

import { ethers } from 'ethers';

export interface TransactionStatus {
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  confirmations: number;
  receipt?: ethers.providers.TransactionReceipt;
}

export async function monitorTransaction(
  provider: ethers.providers.Web3Provider,
  txHash: string,
  onStatus: (status: TransactionStatus) => void
): Promise<TransactionStatus> {
  return new Promise((resolve, reject) => {
    const checkReceipt = async () => {
      try {
        const receipt = await provider.getTransactionReceipt(txHash);
        
        if (!receipt) {
          onStatus({
            status: 'pending',
            hash: txHash,
            confirmations: 0
          });
          setTimeout(checkReceipt, 3000);
          return;
        }

        const status: TransactionStatus = {
          status: receipt.status ? 'confirmed' : 'failed',
          hash: txHash,
          confirmations: receipt.confirmations,
          receipt
        };

        onStatus(status);
        resolve(status);
      } catch (error) {
        reject(error);
      }
    };

    checkReceipt();
  });
}