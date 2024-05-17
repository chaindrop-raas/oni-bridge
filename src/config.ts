// import { connectorsForWallets } from "@rainbow-me/rainbowkit";
// import {
//   rainbowWallet,
//   metaMaskWallet,
//   coinbaseWallet,
// } from "@rainbow-me/rainbowkit/wallets";
import { createPublicClient, defineChain, getContract, http,
} from "viem";
import {
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia, 
} from "viem/chains";
import { createConfig } from "wagmi";
import { erc20Abi, optimismPortalAbi, l1tol2mesAbi } from "./abi";

import type { PublicL1ClientWithChain, PublicL2ClientWithChain } from "./types";
import { chainConfig, publicActionsL1, publicActionsL2 } from "viem/op-stack";

/**
 * NB: adding custom connectors for wallets relies on WalletConnect.
 * WalletConnect, in turn, shows errors in the console when developing locally.
 * Dodging the issue for now by commenting out the custom connectors code.
 */

/**
 * TODO:
 * - load walletConnect project id from the environment:
 */
//
const JibchainTestnet = defineChain({
  // ...chainConfig,
  id: 88991,
  name: 'JibchainTestnet',
  nativeCurrency: {
      decimals: 18,
      name: 'tJBC',
      symbol: 'tJBC',
  },
  rpcUrls: {
      default: {
          http: ['https://rpc.testnet.jibchain.net'],
          webSocket: [''],
      },
  },
  blockExplorers: {
      default: { name: 'Explorer', url: 'https://exp.testnet.jibchain.net/' },
  },
  contracts: {
    multicall3: {
      address: '0xa1a858ad9041B4741e620355a3F96B3c78e70ecE',
      blockCreated: 32848,
    },
  },
});

const getChain = (chainId: number) => {
  const supportedChains = [
    mainnet,
    base,
    sepolia,
    optimism,
    baseSepolia,
    optimismSepolia, 
    JibchainTestnet,
  ];
  const detectedChain = supportedChains.find((chain) => chain.id === chainId);
  if (!detectedChain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return detectedChain;
};

export const parentChain = getChain(Number(import.meta.env.VITE_L1_CHAIN_ID));

const rpcUrls: string[] = import.meta.env.VITE_L2_RPC_URLS.split(",");

export const rollupChain = defineChain({
  ...chainConfig,
  id: Number(import.meta.env.VITE_L2_CHAIN_ID),
  name: import.meta.env.VITE_L2_CHAIN_NAME,
  nativeCurrency: {
    decimals: Number(import.meta.env.VITE_L1_CUSTOM_GAS_TOKEN_DECIMALS),
    name: import.meta.env.VITE_L1_CUSTOM_GAS_TOKEN_NAME,
    symbol: import.meta.env.VITE_L1_CUSTOM_GAS_TOKEN_SYMBOL,
  },
  rpcUrls: {
    default: {
      http: rpcUrls,
    },
  },
  blockExplorers: {
    default: {
      name: `${import.meta.env.VITE_L2_CHAIN_NAME} Explorer`,
      url: import.meta.env.VITE_L2_EXPLORER_URL,
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l2OutputOracle: {
      [parentChain.id]: {
        address: '0x74Ad6E0FB793eB5e6c1ff1225B03F5C5fFB7EF0c',
      },
    },
    portal: {
      [parentChain.id]: {
        address: '0x0d605bb7d4FB586eAB750205F5247825F4D8AF4B',
      },
    },
    // multicall3: {
    //   [parentChain.id]: {
    //     address: '0xa1a858ad9041B4741e620355a3F96B3c78e70ecE',
    //   },
    // },
  },
});

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: "Suggested",
//       wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet],
//     },
//   ],
//   {
//     appName: `{customTestnet.name} Bridge`,
//     projectId: "{process.env.VITE_WALLET_CONNECT_PROJECT_ID}",
//   }
// );



export const parentClient = createPublicClient({
  chain: JibchainTestnet,
  transport: http(),
}).extend(publicActionsL1()) as PublicL1ClientWithChain;

export const rollupClient = createPublicClient({
  chain: rollupChain,
  transport: http(),
}).extend(publicActionsL2()) as PublicL2ClientWithChain;

export const L1ToL2Mes = getContract({
  address: import.meta.env.VITE_L1_TO_L2_MES_ADDRESS,
  abi: l1tol2mesAbi,
  client: rollupClient,
});

// export const l2native = getContract({
//   address: import.meta.env.VITE_L1_L2_NATIVE,
//   abi: erc20Abi,
//   client: rollupClient,
// });



export const token = getContract({
  address: import.meta.env.VITE_L1_CUSTOM_GAS_TOKEN_ADDRESS,
  abi: erc20Abi,
  client: parentClient,
});

export const optimismPortal = getContract({
  address: import.meta.env.VITE_L1_OPTIMISM_PORTAL_ADDRESS,
  abi: optimismPortalAbi,
  client: parentClient,
});



// export const L1ToL2Mes = getContract({
//   address: import.meta.env.VITE_L1_TO_L2_MES_ADDRESS,
//   abi: l1tol2mesAbi,
//   client: parentClient,
// });

export const config = createConfig({
  // connectors: connectors,
  chains: [parentChain, rollupChain],
  transports: {
    [rollupChain.id]: http(),
    [parentChain.id]: http(),
  },
});

export const rollupConfig = createConfig({
  chains: [rollupChain],
  transports: {
    [rollupChain.id]: http(),
  },
});
