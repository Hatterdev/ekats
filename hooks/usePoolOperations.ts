'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { getContract } from '@/lib/contract';

export function usePoolOperations() {
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const toast = useToast();

  const stake = async (
    provider: ethers.providers.Web3Provider,
    poolId: number,
    amount: string
  ) => {
    try {
      setIsStaking(true);
      const contract = getContract(provider);
      const amountInWei = ethers.utils.parseEther(amount);

      const tx = await contract.stake(poolId, amountInWei);
      await tx.wait();

      toast({
        title: 'Stake Successful',
        description: `Successfully staked ${amount} tokens`,
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

  const withdraw = async (
    provider: ethers.providers.Web3Provider,
    poolId: number,
    amount: string
  ) => {
    try {
      setIsWithdrawing(true);
      const contract = getContract(provider);
      const amountInWei = ethers.utils.parseEther(amount);

      const tx = await contract.claimAndUnstake(poolId, amountInWei);
      await tx.wait();

      toast({
        title: 'Withdrawal Successful',
        description: `Successfully withdrawn ${amount} tokens`,
        status: 'success',
        duration: 5000,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Withdrawal Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
      return false;
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    stake,
    withdraw,
    isStaking,
    isWithdrawing,
  };
}
