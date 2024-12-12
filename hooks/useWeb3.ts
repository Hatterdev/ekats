'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this dApp');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      // Check if connected to Binance Smart Chain
      if (network.chainId !== 56) {
        const switched = await switchToBSC(provider);
        if (!switched) {
          setError('Please switch to Binance Smart Chain manually.');
          return;
        }
      }

      setProvider(provider);
      setAccount(accounts[0]);
      setChainId(56); // Since we ensured it is on Binance Smart Chain
      setError(null);
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return { provider, account, chainId, error, connectWallet };
}

// Helper to switch to Binance Smart Chain
const switchToBSC = async (
  provider: ethers.providers.Web3Provider
): Promise<boolean> => {
  try {
    // Try switching to Binance Smart Chain
    await provider.send('wallet_switchEthereumChain', [
      { chainId: ethers.utils.hexValue(56) },
    ]);
    return true;
  } catch (error) {
    // If the network is not added, add it
    if ((error as any).code === 4902) {
      try {
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: ethers.utils.hexValue(56),
            chainName: 'Binance Smart Chain',
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            nativeCurrency: {
              name: 'Binance Coin',
              symbol: 'BNB',
              decimals: 18,
            },
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ]);
        return true;
      } catch (addError) {
        console.error('Failed to add Binance Smart Chain:', addError);
        return false;
      }
    } else {
      console.error('Failed to switch network:', error);
      return false;
    }
  }
};
