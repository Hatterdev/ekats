import { ethers } from 'ethers';

export const formatAddress = (address: string) => 
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const formatNumber = (num: number | string) => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrency = (amount: string) => {
  const value = ethers.utils.formatEther(amount);
  return formatNumber(value);
};