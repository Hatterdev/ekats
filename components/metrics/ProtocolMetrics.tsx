'use client';

import {
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { getContract } from '@/lib/contract';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

const MotionStat = motion(Stat);

export function ProtocolMetrics() {
  const { provider } = useWeb3();
  const [metrics, setMetrics] = useState({
    totalPools: 0,
    totalStaked: 0,
    tvl: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!provider) return;
      
      const contract = getContract(provider);
      const totalPools = await contract.getTotalPools();
      let totalStaked = ethers.BigNumber.from(0);
      
      for (let i = 0; i < totalPools.toNumber(); i++) {
        const pool = await contract.getPoolDetails(i);
        totalStaked = totalStaked.add(pool.totalStaked);
      }

      setMetrics({
        totalPools: totalPools.toNumber(),
        totalStaked: parseFloat(ethers.utils.formatEther(totalStaked)),
        tvl: parseFloat(ethers.utils.formatEther(totalStaked)) * 2
      });
    };

    fetchMetrics();
  }, [provider]);

  return (
    <Grid
      templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
      gap={8}
      p={6}
      bg="gray.800"
      borderRadius="xl"
      border="1px"
      borderColor="whiteAlpha.200"
    >
      <GridItem>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          textAlign="center"
        >
          <StatLabel color="gray.400">Total Pools</StatLabel>
          <StatNumber color="green.400" textShadow="0 0 10px #39FF14">
            {metrics.totalPools.toLocaleString()}
          </StatNumber>
        </MotionStat>
      </GridItem>
      <GridItem>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          textAlign="center"
        >
          <StatLabel color="gray.400">Total Staked</StatLabel>
          <StatNumber color="green.400" textShadow="0 0 10px #39FF14">
            {metrics.totalStaked.toLocaleString()} GIC
          </StatNumber>
        </MotionStat>
      </GridItem>
      <GridItem>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          textAlign="center"
        >
          <StatLabel color="gray.400">Total Value Locked</StatLabel>
          <StatNumber color="green.400" textShadow="0 0 10px #39FF14">
            ${metrics.tvl.toLocaleString()}
          </StatNumber>
        </MotionStat>
      </GridItem>
    </Grid>
  );
}