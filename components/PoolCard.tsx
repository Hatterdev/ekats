'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { getContract } from '@/lib/contract';
import { formatCurrency } from '@/lib/utils/format';

interface PoolCardProps {
  poolId: number;
  poolDetails: {
    creator: string;
    rewardToken: string;
    totalRewards: string;
    duration: string;
    startTime: string;
    endTime: string;
    totalStaked: string;
    participantCount: string;
    userStake?: {
      amount: string;
    };
  };
  onRefresh: () => void;
}

export function PoolCard({ poolId, poolDetails, onRefresh }: PoolCardProps) {
  const { provider, account } = useWeb3();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStake = async () => {
    if (!provider || !account || !stakeAmount) return;

    try {
      setIsLoading(true);
      const contract = getContract(provider);
      const tx = await contract.stake(poolId, ethers.utils.parseEther(stakeAmount));
      await tx.wait();
      onRefresh();
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!provider || !account) return;

    try {
      setIsLoading(true);
      const contract = getContract(provider);
      const tx = await contract.claimAndUnstake(poolId, 0);
      await tx.wait();
      onRefresh();
    } catch (error) {
      console.error('Claiming failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card bg="gray.800" borderColor="whiteAlpha.200">
      <CardHeader>
        <Heading size="md">Pool #{poolId}</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <Flex justify="space-between" fontSize="sm">
            <Text color="gray.400">Total Staked</Text>
            <Text>{formatCurrency(poolDetails.totalStaked)} GIC</Text>
          </Flex>

          <Flex justify="space-between" fontSize="sm">
            <Text color="gray.400">Duration</Text>
            <Text>{parseInt(poolDetails.duration) / 86400} days</Text>
          </Flex>

          {account && (
            <Box>
              <Progress
                value={
                  Number(poolDetails.totalStaked) > 0
                    ? (Number(poolDetails.userStake?.amount || 0) / Number(poolDetails.totalStaked)) * 100
                    : 0
                }
                colorScheme="green"
                size="sm"
                mb={2}
              />
              <Text fontSize="sm" color="gray.400">
                Your Stake: {formatCurrency(poolDetails.userStake?.amount || '0')} GIC
              </Text>
            </Box>
          )}

          <Stack spacing={2}>
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              bg="gray.900"
            />
            <Flex gap={2}>
              <Button
                flex={1}
                onClick={handleStake}
                isDisabled={isLoading || !account}
                colorScheme="green"
              >
                Stake
              </Button>
              <Button
                flex={1}
                onClick={handleClaim}
                isDisabled={isLoading || !account}
                variant="outline"
                colorScheme="green"
              >
                Claim Rewards
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}