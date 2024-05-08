/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_L1_CUSTOM_GAS_TOKEN_ADDRESS: `0x${string}`;
  readonly VITE_L1_OPTIMISM_PORTAL_ADDRESS: `0x${string}`;
  readonly VITE_L1_CUSTOM_GAS_TOKEN_NAME: string;
  readonly VITE_L1_CUSTOM_GAS_TOKEN_SYMBOL: string;
  readonly VITE_L1_CUSTOM_GAS_TOKEN_DECIMALS: number;
  readonly VITE_L1_CHAIN_ID: number;

  readonly VITE_L2_CHAIN_ID: number;
  readonly VITE_L2_CHAIN_NAME: string;
  readonly VITE_L2_RPC_URLS: string;
  readonly VITE_L2_EXPLORER_URL: string;
  readonly VITE_L2_OUTPUT_ORACLE_ADDRESS: `0x${string}`;
}
