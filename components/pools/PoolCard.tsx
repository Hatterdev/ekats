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
  useColorModeValue,
} from '@chakra-ui/react';
import { TimeIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { getContract } from '@/lib/contract';
import { formatCurrency } from '@/lib/utils/format';

interface PoolCardProps {
  pool: any;
  onUpdate: () => void;
}

export function PoolCard({ pool, onUpdate }: PoolCardProps) {
  const { provider, account } = useWeb3();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const timeRemaining = pool.endTime * 1000 - Date.now();
  const apy = (Number(pool.totalRewards) / Number(pool.totalStaked) * 100).toFixed(2);

  const handleStake = async () => {
    if (!provider || !account || !amount) return;

    try {
      setLoading(true);
      const contract = getContract(provider);
      const tx = await contract.stake(pool.id, ethers.utils.parseEther(amount));
      await tx.wait();
      onUpdate();
      setAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!provider || !account) return;

    try {
      setLoading(true);
      const contract = getContract(provider);
      const tx = await contract.claimAndUnstake(pool.id, 0);
      await tx.wait();
      onUpdate();
    } catch (error) {
      console.error('Claiming failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      bg="gray.800"
      borderColor="whiteAlpha.200"
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">Pool #{pool.id}</Heading>
          <Flex align="center" gap={2} color="green.400">
            <TriangleUpIcon />
            <Text>{apy}% APY</Text>
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody>
        <Stack spacing={4}>
          <Flex justify="space-between" fontSize="sm">
            <Text color="gray.400">Total Staked</Text>
            <Text>{formatCurrency(pool.totalStaked)} GIC</Text>
          </Flex>

          <Flex justify="space-between" fontSize="sm">
            <Flex align="center" gap={2}>
              <TimeIcon />
              <Text>Time Remaining</Text>
            </Flex>
            <Text>
              {Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)))} days
            </Text>
          </Flex>

          {account && (
            <Box>
              <Progress
                value={Number(pool.userStake?.amount || 0) / Number(pool.totalStaked) * 100}
                colorScheme="green"
                size="sm"
                mb={2}
              />
              <Text fontSize="sm" color="gray.400">
                Your Stake: {formatCurrency(pool.userStake?.amount || '0')} GIC
              </Text>
            </Box>
          )}

          <Stack spacing={2}>
            <Input
              type="number"
              placeholder="Amount to stake"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              bg="gray.900"
            />
            <Flex gap={2}>
              <Button
                flex={1}
                onClick={handleStake}
                isDisabled={loading || !account}
                colorScheme="green"
              >
                Stake
              </Button>
              <Button
                flex={1}
                onClick={handleClaim}
                isDisabled={loading || !account || !pool.pendingRewards}
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