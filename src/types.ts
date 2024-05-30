import { createPublicClient, Account, Chain } from "viem";
import { getWithdrawalStatus } from "viem/op-stack";
import {
  PublicActionsL1,
  PublicActionsL2,
  WalletActionsL1,
  WalletActionsL2,
} from "viem/op-stack";
import { UseWalletClientReturnType } from "wagmi";
import { rollupChain } from "./config";

type MakeKeyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type MaybeExplorers = Chain["blockExplorers"];

type ChainWithExplorer = Chain & {
  blockExplorers: MakeKeyRequired<MaybeExplorers, keyof MaybeExplorers>;
};

export type PublicClientWithChain = ReturnType<typeof createPublicClient> & {
  chain: ChainWithExplorer;
};

export type PublicL1ClientWithChain = PublicClientWithChain &
  PublicActionsL1<ChainWithExplorer, Account>;

export type PublicL2ClientWithChain = PublicClientWithChain &
  PublicActionsL2<typeof rollupChain, Account>;

export type WalletClient = NonNullable<UseWalletClientReturnType["data"]>;

export type L1WalletClient = WalletClient &
  WalletActionsL1<ChainWithExplorer, Account>;

export type L2WalletClient = WalletClient &
  WalletActionsL2<ChainWithExplorer, Account>;

export type BridgeMode = "deposit" | "withdraw";

export type StatusReturnType =
  | Awaited<ReturnType<typeof getWithdrawalStatus>>
  | "retrieving-status"
  | "initializing";

export type TransactionType = "deposit" | "withdrawal" | "approval" | "unknown";
