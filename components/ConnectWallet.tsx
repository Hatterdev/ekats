'use client';

import { Button, Text } from '@chakra-ui/react';
import { useWeb3 } from '@/hooks/useWeb3';

export function ConnectWallet() {
  const { account, connectWallet, error } = useWeb3();

  return (
    <>
      {error && (
        <Text color="red.400" fontSize="sm">{error}</Text>
      )}
      {account ? (
        <Text fontSize="sm" fontWeight="medium">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </Text>
      ) : (
        <Button onClick={connectWallet} colorScheme="green">
          Connect Wallet
        </Button>
      )}
    </>
  );
}