'use client';

import { useEffect, useState } from 'react';
import { PoolCard } from './PoolCard';
import { useWeb3 } from '@/hooks/useWeb3';
import { getContract } from '@/lib/contract';
import { motion } from 'framer-motion';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {pools.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          onUpdate={loadPools}
        />
      ))}
    </motion.div>
  );
}