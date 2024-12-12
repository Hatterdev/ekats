'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';
import { useWeb3 } from '@/hooks/useWeb3';

export function CreatePool({ onPoolCreated }: { onPoolCreated: () => void }) {
  const { provider, account } = useWeb3();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    rewardToken: '',
    totalRewards: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!provider || !account) return;

    try {
      setIsLoading(true);
      const contract = getContract(provider);
      const tx = await contract.createPool(
        formData.rewardToken,
        ethers.utils.parseEther(formData.totalRewards),
        parseInt(formData.duration) * 86400 // Convert days to seconds
      );
      await tx.wait();
      onClose();
      onPoolCreated();
    } catch (error) {
      console.error('Pool creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">Create New Pool</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Create Staking Pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Reward Token Address</FormLabel>
                <Input
                  value={formData.rewardToken}
                  onChange={(e) => setFormData(prev => ({ ...prev, rewardToken: e.target.value }))}
                  placeholder="0x..."
                  bg="gray.900"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Total Rewards</FormLabel>
                <Input
                  type="number"
                  value={formData.totalRewards}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalRewards: e.target.value }))}
                  placeholder="Amount in GIC"
                  bg="gray.900"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Duration (days)</FormLabel>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="1-365 days"
                  min="1"
                  max="365"
                  bg="gray.900"
                />
              </FormControl>

              <Button
                width="full"
                onClick={handleCreate}
                isDisabled={isLoading || !account}
                colorScheme="green"
                mt={4}
              >
                Create Pool
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}