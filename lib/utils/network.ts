import { ethers } from 'ethers';

// Defina o tipo para SUPPORTED_NETWORKS, especificando que as chaves são números
export const SUPPORTED_NETWORKS: { [key: number]: string } = {
  1: 'Ethereum Mainnet',
  56: 'Binance Smart Chain', // Adicionando BSC
  // Adicione outras redes conforme necessário
};

// Função para validar a rede conectada
export const validateNetwork = async (
  provider: ethers.providers.Web3Provider
): Promise<{ isValid: boolean; network: string }> => {
  const network = await provider.getNetwork();
  const isValid = network.chainId in SUPPORTED_NETWORKS;

  return {
    isValid,
    network: SUPPORTED_NETWORKS[network.chainId] || 'Unsupported Network',
  };
};

// Função para trocar de rede para o `targetChainId`
export const switchNetwork = async (
  provider: ethers.providers.Web3Provider,
  targetChainId: number
): Promise<boolean> => {
  try {
    // Tenta trocar de rede
    await provider.send('wallet_switchEthereumChain', [
      { chainId: ethers.utils.hexValue(targetChainId) },
    ]);
    return true;
  } catch (error) {
    // Se a rede não estiver adicionada, tenta adicioná-la
    if ((error as any).code === 4902) {
      try {
        // Verifique se a rede é a BSC
        if (targetChainId === 56) {
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
        }
        // Caso de outras redes (adicione conforme necessário)
        return false;
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
