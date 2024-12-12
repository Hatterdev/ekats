'use client';

import { Box, Container, Heading, Stack } from '@chakra-ui/react';
import { ConnectWallet } from '@/components/ConnectWallet';
import { ProtocolMetrics } from '@/components/metrics/ProtocolMetrics';
import { PoolList } from '@/components/pools/PoolList';
import { CreatePool } from '@/components/CreatePool';
import { useWeb3 } from '@/hooks/useWeb3';

export default function Home() {
  const { account } = useWeb3();

  return (
    <Box minH="100vh">
      <Box as="header" borderBottom="1px" borderColor="whiteAlpha.200" py={4}>
        <Container maxW="container.xl">
          <Stack direction="row" justify="space-between" align="center">
            <Heading
              size="lg"
              color="brand.neonGreen"
              textShadow="0 0 10px #39FF14"
            >
              GIC Staking
            </Heading>
            <ConnectWallet />
          </Stack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <ProtocolMetrics />
          
          <Stack direction="row" justify="space-between" align="center">
            <Heading size="md">Staking Pools</Heading>
            {account && <CreatePool onPoolCreated={() => {}} />}
          </Stack>

          <PoolList />
        </Stack>
      </Container>
    </Box>
  );
}