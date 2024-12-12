'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';

export interface PoolData {
  id: number;
  creator: string;
  rewardToken: string;
  totalRewards: string;
  duration: string;
  startTime: string;
  endTime: string;
  totalStaked: string;
  participantCount: string;
  apy: number;
  userStake?: {
    amount: string;
    rewardsClaimed: string;
    timestamp: string;
  };
  pendingRewards?: string;
}

export function usePoolData(provider: ethers.providers.Web3Provider | null, account: string | null) {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPools = async () => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract(provider);
      const totalPools = await contract.getTotalPools();
      
      const poolPromises = [];
      for (let i = 0; i < totalPools.toNumber(); i++) {
        poolPromises.push(Promise.all([
          contract.getPoolDetails(i),
          account ? contract.getUserStake(i, account) : null,
          account ? contract.pendingRewards(i, account) : null
        ]));
      }
      
      const poolsData = await Promise.all(poolPromises);
      const formattedPools = poolsData.map(([details, stake, rewards], index) => {
        const totalStaked = ethers.utils.formatEther(details.totalStaked);
        const totalRewards = ethers.utils.formatEther(details.totalRewards);
        
        // Calculate APY
        const durationInYears = Number(details.duration) / (86400 * 365);
        const apy = Number(totalStaked) > 0 
          ? (Number(totalRewards) / Number(totalStaked) / durationInYears * 100)
          : 0;

        return {
          id: index,
          ...details,
          apy,
          userStake: stake,
          pendingRewards: rewards
        };
      });

      setPools(formattedPools);
    } catch (error) {
      console.error('Failed to load pools:', error);
      setError('Failed to load pool data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPools();
  }, [provider, account]);

  return { pools, isLoading, error, refreshPools: loadPools };
}