import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = '0xYourContractAddressHere';

export const CONTRACT_ABI = [
  // Pool Management
  'function createPool(address _rewardToken, uint256 _totalRewards, uint256 _duration) external',
  'function updatePool(uint256 poolId, uint256 newTotalRewards, uint256 newDuration) external',
  'function updateRewardToken(uint256 poolId, address newRewardToken) external',
  
  // Staking Functions
  'function stake(uint256 poolId, uint256 amount) external',
  'function stakeMultiple(uint256[] calldata poolIds, uint256[] calldata amounts) external',
  'function compoundRewards(uint256 poolId) external',
  'function claimAndUnstake(uint256 poolId, uint256 amount) external',
  
  // View Functions
  'function pendingRewards(uint256 poolId, address user) external view returns (uint256)',
  'function getPoolDetails(uint256 poolId) external view returns (address creator, address rewardToken, uint256 totalRewards, uint256 duration, uint256 startTime, uint256 endTime, uint256 totalStaked, uint256 participantCount)',
  'function getUserStake(uint256 poolId, address user) external view returns (uint256 amount, uint256 rewardsClaimed, uint256 timestamp)',
  'function getTotalPools() external view returns (uint256)',
  'function isPoolParticipant(uint256 poolId, address user) external view returns (bool)',
  
  // Constants
  'function DEPOSIT_FEE() external view returns (uint256)',
  'function EARLY_WITHDRAW_FEE() external view returns (uint256)',
  'function REWARD_WITHDRAW_FEE() external view returns (uint256)',
];

export const getContract = (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};