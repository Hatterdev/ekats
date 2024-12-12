'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { validateNetwork, SUPPORTED_NETWORKS } from '@/lib/utils/network';

export function useNetworkStatus(provider: ethers.providers.Web3Provider | null) {
  const [networkStatus, setNetworkStatus] = useState({
    isValid: false,
    network: '',
    blockNumber: 0,
    isLoading: true
  });
  const toast = useToast();

  useEffect(() => {
    if (!provider) {
      setNetworkStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkNetwork = async () => {
      try {
        const { isValid, network } = await validateNetwork(provider);
        const blockNumber = await provider.getBlockNumber();

        setNetworkStatus({
          isValid,
          network,
          blockNumber,
          isLoading: false
        });

        if (!isValid) {
          toast({
            title: 'Network Error',
            description: `Please connect to one of: ${Object.values(SUPPORTED_NETWORKS).join(', ')}`,
            status: 'warning',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Network check failed:', error);
        setNetworkStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkNetwork();

    // Subscribe to network changes
    const handleNetworkChange = () => checkNetwork();
    provider.on('network', handleNetworkChange);
    provider.on('block', (blockNumber: number) => {
      setNetworkStatus(prev => ({ ...prev, blockNumber }));
    });

    return () => {
      provider.removeListener('network', handleNetworkChange);
      provider.removeListener('block', () => {});
    };
  }, [provider, toast]);

  return networkStatus;
}