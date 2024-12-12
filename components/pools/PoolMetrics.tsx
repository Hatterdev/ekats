'use client';

import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from '@chakra-ui/react';
import { TimeIcon, RepeatIcon, StarIcon } from '@chakra-ui/icons';
import { formatCurrency } from '@/lib/utils/format';
import { PoolData } from '@/hooks/usePoolData';

interface PoolMetricsProps {
  pool: PoolData;
}

export function PoolMetrics({ pool }: PoolMetricsProps) {
  const timeRemaining = Number(pool.endTime) * 1000 - Date.now();
  const daysRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <Stat>
        <StatLabel display="flex" alignItems="center">
          <Icon as={StarIcon} mr={2} />
          APY
        </StatLabel>
        <StatNumber>{pool.apy.toFixed(2)}%</StatNumber>
        <StatHelpText>Annual Percentage Yield</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel display="flex" alignItems="center">
          <Icon as={RepeatIcon} mr={2} />
          Total Staked
        </StatLabel>
        <StatNumber>{formatCurrency(pool.totalStaked)} GIC</StatNumber>
        <StatHelpText>{pool.participantCount} Participants</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel display="flex" alignItems="center">
          <Icon as={TimeIcon} mr={2} />
          Time Remaining
        </StatLabel>
        <StatNumber>{daysRemaining} Days</StatNumber>
        <StatHelpText>
          {new Date(Number(pool.endTime) * 1000).toLocaleDateString()}
        </StatHelpText>
      </Stat>
    </SimpleGrid>
  );
}