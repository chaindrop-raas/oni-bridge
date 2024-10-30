import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { createPublicClient, defineChain, getContract, http } from "viem";
import {
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { createConfig } from "wagmi";
import { erc20Abi, optimismPortalAbi } from "./abi";

import type { PublicL1ClientWithChain, PublicL2ClientWithChain } from "./types";
import { chainConfig, publicActionsL1, publicActionsL2 } from "viem/op-stack";

const getChain = (chainId: number) => {
  const supportedChains = [
    mainnet,
    base,
    sepolia,
    optimism,
    baseSepolia,
    optimismSepolia,
  ];
  const detectedChain = supportedChains.find((chain) => chain.id === chainId);
  if (!detectedChain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return detectedChain;
};

export const parentChain = {
  ...getChain(Number(import.meta.env.VITE_L1_CHAIN_ID)),
  iconBackground: import.meta.env.VITE_L1_ICON_BACKGROUND,
  iconUrl: import.meta.env.VITE_L1_ICON_URL,
};

const rpcUrls: string[] = import.meta.env.VITE_L2_RPC_URLS.split(",");

export const rollupChain = defineChain({
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
    disputeGameFactory: {
      [parentChain.id]: {
        address: import.meta.env.VITE_DISPUTE_GAME_FACTORY_ADDRESS,
      },
    },
    l2OutputOracle: {
      [parentChain.id]: {
        address: import.meta.env.VITE_L2_OUTPUT_ORACLE_ADDRESS,
      },
    },
    portal: {
      [parentChain.id]: {
        address: import.meta.env.VITE_L1_OPTIMISM_PORTAL_ADDRESS,
      },
    },
  },
  iconBackground: import.meta.env.VITE_L2_ICON_BACKGROUND_COLOR,
  iconUrl: import.meta.env.VITE_L2_ICON_URL,
});

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
const appName = `${rollupChain.name} Bridge`;

const { wallets } = getDefaultWallets({
  appName,
  projectId,
});

const connectors = connectorsForWallets(wallets, {
  projectId,
  appName,
});

const l1Transport = import.meta.env.VITE_L1_PUBLIC_RPC_URL
  ? http(import.meta.env.VITE_L1_PUBLIC_RPC_URL, { batch: true })
  : http();

export const parentClient = createPublicClient({
  chain: parentChain,
  transport: l1Transport,
}).extend(publicActionsL1()) as PublicL1ClientWithChain;

export const rollupClient = createPublicClient({
  chain: rollupChain,
  transport: http(),
}).extend(publicActionsL2()) as PublicL2ClientWithChain;

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

export const config = createConfig({
  connectors: connectors,
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
