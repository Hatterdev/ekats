import { ethers } from 'ethers';

export const validateAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

export const validateAmount = (amount: string, balance: string): boolean => {
  try {
    const amountBN = ethers.utils.parseEther(amount);
    const balanceBN = ethers.utils.parseEther(balance);
    return amountBN.gt(0) && amountBN.lte(balanceBN);
  } catch {
    return false;
  }
};

export const validatePoolParams = (
  rewardToken: string,
  totalRewards: string,
  duration: number
): string | null => {
  if (!validateAddress(rewardToken)) {
    return 'Invalid reward token address';
  }
  
  if (isNaN(Number(totalRewards)) || Number(totalRewards) <= 0) {
    return 'Invalid reward amount';
  }
  
  if (duration < 1 || duration > 365) {
    return 'Duration must be between 1 and 365 days';
  }
  
  return null;
};