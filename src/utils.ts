import { format } from "dnum";
import {
  getAddress,
  type WaitForTransactionReceiptReturnType,
  zeroAddress,
  Address,
  WalletClient,
  Chain,
} from "viem";

import {
  optimismPortal,
  parentChain,
  parentClient,
  rollupChain,
  rollupClient,
  token,
} from "./config";
import type {
  BridgeId,
  StatusReturnType,
  TransactionStore,
  TransactionType,
} from "./types";

/**
 * Formats the balance of a token with the specified number of decimals.
 * @param balance - The balance of the token as a bigint.
 * @param decimals - The number of decimals to use for formatting.
 * @returns The formatted balance as a string.
 */
export const formatBalance = (balance: bigint, decimals: number) => {
  return format([balance, decimals], {
    digits: 18,
    trailingZeros: false,
  });
};

/**
 * Checks if the gas token is a custom gas token.
 * @returns {boolean} Returns false if the gas token is the zero address, true otherwise.
 */
export const isCustomGasToken = () =>
  import.meta.env.VITE_L1_CUSTOM_GAS_TOKEN_ADDRESS !== zeroAddress;

/**
 * Converts a string to title case.
 * @param str - The string to convert.
 * @returns The converted string in title case.
 */
export const titleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
};

/**
 * Determines the type of transaction based on the recipient address.
 * @param transaction - The transaction object.
 * @returns The type of transaction: "withdrawal", "deposit", "approval", or "unknown".
 */
export const txType = (
  transaction: WaitForTransactionReceiptReturnType
): TransactionType => {
  if (!transaction.to) return "unknown";
  switch (getAddress(transaction.to)) {
    case getAddress(rollupChain.contracts.l2ToL1MessagePasser.address):
      return "withdrawal";
    case getAddress(optimismPortal.address):
      return "deposit";
    case getAddress(token.address):
      return "approval";
    default:
      return "unknown";
  }
};

/**
 * Returns the block explorer URL for a given transaction.
 * @param tx - The transaction object.
 * @returns The block explorer URL for the transaction.
 */
export const blockExplorerURL = (tx: WaitForTransactionReceiptReturnType) => {
  const label = txType(tx);
  switch (label) {
    case "withdrawal":
      return `${rollupClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
    default:
      return `${parentClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
  }
};

/**
 * Converts the status string to a corresponding step number.
 * @param status - The status string.
 * @returns The step number.
 */
export const statusStep = (status: StatusReturnType) => {
  switch (status) {
    case "waiting-to-prove":
      return 1;
    case "ready-to-prove":
      return 2;
    case "waiting-to-finalize":
      return 3;
    case "ready-to-finalize":
      return 4;
    case "finalized":
      return 5;
    default:
      return 0;
  }
};

/**
 * Returns a bridge ID composed of the parent chain ID and the rollup chain ID.
 * @returns The bridge ID.
 */
export const getBridgeId = (): BridgeId => {
  return `${parentChain.id}:${rollupChain.id}`;
};

/**
 * Retrieves the transactions for a specific address from the transaction store.
 * @param transactionStore - The transaction store object.
 * @param address - The address for which to retrieve the transactions.
 * @returns An array of transactions for the specified address.
 */
export const getTransactions = (
  transactionStore: TransactionStore,
  address: Address
) => {
  const bridgeId = getBridgeId();
  return (transactionStore[address] ?? {})[bridgeId] ?? [];
};

/**
 * Attempts to switch the current wallet's chain to the specified chain.
 * If the switch fails due to user rejection (error 4001), the error is ignored.
 * For other errors, the function attempts to add the chain and retry the switch.
 * This function retries critical operations to handle transient issues.
 *
 * @param walletClient - The wallet client used for chain operations.
 * @param chain - The target chain information to switch to.
 * @returns A promise that resolves when the chain switch is successful, or rejects with an error.
 */
export const ensureChainSwitch = async (
  walletClient: WalletClient,
  chain: Chain
): Promise<void> => {
  await walletClient.switchChain({ id: chain.id }).catch(async (error) => {
    if (error.code === 4001) {
      // User rejected the switch, ignore this error.
      return;
    }

    // Attempt to add the chain and retry switching.
    await walletClient.addChain({ chain });
    await walletClient.switchChain({ id: chain.id });
  });
};
