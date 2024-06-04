import { format } from "dnum";
import { getAddress, type WaitForTransactionReceiptReturnType } from "viem";

import {
  optimismPortal,
  parentClient,
  rollupChain,
  rollupClient,
  token,
} from "./config";
import type { StatusReturnType, TransactionType } from "./types";

export const formatBalance = (balance: bigint, decimals: number) => {
  return format([balance, decimals], {
    digits: 18,
    trailingZeros: false,
  });
};

export const titleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
};

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

export const blockExplorerURL = (tx: WaitForTransactionReceiptReturnType) => {
  const label = txType(tx);
  switch (label) {
    case "withdrawal":
      return `${rollupClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
    default:
      return `${parentClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
  }
};

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
