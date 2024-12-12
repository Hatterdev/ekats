'use client';

import {
  Box,
  Text,
  HStack,
  Badge,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

interface NetworkStatusProps {
  isValid: boolean;
  network: string;
  blockNumber: number;
}

export function NetworkStatus({ isValid, network, blockNumber }: NetworkStatusProps) {
  return (
    <HStack spacing={4}>
      <Tooltip label={isValid ? 'Connected to supported network' : 'Please switch to a supported network'}>
        <HStack>
          <Icon
            as={isValid ? CheckCircleIcon : WarningIcon}
            color={isValid ? 'green.400' : 'yellow.400'}
          />
          <Text fontSize="sm">{network}</Text>
        </HStack>
      </Tooltip>
      
      <Badge colorScheme="blue">
        Block: {blockNumber.toLocaleString()}
      </Badge>
    </HStack>
  );
}