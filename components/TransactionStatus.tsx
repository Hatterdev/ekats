'use client';

import {
  Box,
  Text,
  Progress,
  Link,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { TransactionStatus } from '@/lib/utils/transaction';

interface TransactionStatusProps {
  status: TransactionStatus;
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  const getStatusColor = () => {
    switch (status.status) {
      case 'confirmed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'yellow';
    }
  };

  return (
    <VStack spacing={2} align="stretch">
      <HStack>
        <Text fontWeight="medium">Transaction Status:</Text>
        <Text color={`${getStatusColor()}.400`} textTransform="capitalize">
          {status.status}
        </Text>
        {status.status === 'confirmed' && <Icon as={CheckIcon} color="green.400" />}
        {status.status === 'failed' && <Icon as={WarningIcon} color="red.400" />}
      </HStack>

      {status.status === 'pending' && (
        <Progress size="sm" isIndeterminate colorScheme="yellow" />
      )}

      <Text fontSize="sm">
        Transaction Hash:{' '}
        <Link
          href={`https://bscscan.com/tx/${status.hash}`}
          isExternal
          color="blue.400"
        >
          {status.hash.slice(0, 10)}...{status.hash.slice(-8)}
        </Link>
      </Text>

      {status.confirmations > 0 && (
        <Text fontSize="sm">
          Confirmations: {status.confirmations}
        </Text>
      )}
    </VStack>
  );
}