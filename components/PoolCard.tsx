'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';
import { useWeb3 } from '@/hooks/useWeb3';

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
    <Card>
      <CardHeader>
        <CardTitle>Pool #{poolId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Rewards</p>
              <p className="font-medium">{ethers.utils.formatEther(poolDetails.totalRewards)} GIC</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Staked</p>
              <p className="font-medium">{ethers.utils.formatEther(poolDetails.totalStaked)} GIC</p>
            </div>
            <div>
              <p className="text-muted-foreground">Participants</p>
              <p className="font-medium">{poolDetails.participantCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{parseInt(poolDetails.duration) / 86400} days</p>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleStake}
                disabled={isLoading || !account}
              >
                Stake
              </Button>
              <Button
                className="flex-1"
                onClick={handleClaim}
                disabled={isLoading || !account}
              >
                Claim Rewards
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
