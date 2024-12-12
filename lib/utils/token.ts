'use client';

import { ethers } from 'ethers';

const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export async function checkAllowance(
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<ethers.BigNumber> {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ERC20_ABI,
    provider
  );
  return await tokenContract.allowance(ownerAddress, spenderAddress);
}

export async function approveToken(
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: ethers.BigNumber
): Promise<boolean> {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ERC20_ABI,
    provider.getSigner()
  );
  
  try {
    const tx = await tokenContract.approve(spenderAddress, amount);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Token approval failed:', error);
    return false;
  }
}