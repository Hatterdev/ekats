'use client';

import { useEffect, useState } from 'react';
import { Box, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react';
import { PoolCard } from './PoolCard';
import { useWeb3 } from '@/hooks/useWeb3';
import { getContract } from '@/lib/contract';

export function PoolList() {
  const { provider, account } = useWeb3();
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPools = async () => {
    if (!provider) return;

    try {
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
      setPools(poolsData.map(([details, stake, rewards], index) => ({
        id: index,
        ...details,
        userStake: stake,
        pendingRewards: rewards
      })));
    } catch (error) {
      console.error('Failed to load pools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPools();
  }, [provider, account]);

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height="400px" borderRadius="xl" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {pools.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          onUpdate={loadPools}
        />
      ))}
    </SimpleGrid>
  );
}