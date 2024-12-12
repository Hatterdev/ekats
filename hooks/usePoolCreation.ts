'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { getContract } from '@/lib/contract';

export function usePoolOperations() {
  const [isStaking, setIsStaking] = useState(false);
  const toast = useToast();

  const stakeTokens = async (
    provider: ethers.providers.Web3Provider,
    poolId: number,
    amount: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid staking amount',
        status: 'error',
        duration: 5000,
      });
      return false;
    }

    try {
      setIsStaking(true);
      const contract = getContract(provider);

      // Convert amount to Wei
      const amountInWei = ethers.utils.parseEther(amount);

      const tx = await contract.stakeTokens(poolId, amountInWei);
      await tx.wait();

      toast({
        title: 'Stake Successful',
        description: 'Your tokens have been successfully staked',
        status: 'success',
        duration: 5000,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Stake Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      return false;
    } finally {
      setIsStaking(false);
    }
  };

  return { stakeTokens, isStaking };
}
