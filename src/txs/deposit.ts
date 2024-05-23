import { toHex } from "viem";

import { erc20Abi, optimismPortalAbi, l1StandardBridgeAbi } from "../abi";
import { parentClient, 
  token, newToken1, newToken2,
  optimismPortal, l1StandardBridge } from "../config";
import { WalletClient } from "../types";

const simulateApproveTransaction = async (
  walletClient: WalletClient,
  amount: bigint,
  useStandardBridge: boolean
) => {
  const approveToAddress = useStandardBridge ? l1StandardBridge.address : optimismPortal.address;
  const tokenAddress = useStandardBridge ? newToken1.address : newToken2.address;
  return await parentClient.simulateContract({
    account: walletClient.account.address,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [approveToAddress, amount],
  });
};

export const approvalTransaction = async (
  walletClient: WalletClient,
  amount: bigint,
  useStandardBridge: false //
) => {
  const approvalSimulation = await simulateApproveTransaction(
    walletClient,
    amount,
    useStandardBridge
  );
  const approvalHash = await walletClient.writeContract(
    approvalSimulation.request
  );
  return await parentClient.waitForTransactionReceipt({
    hash: approvalHash,
  });
};


const simulateDepositERC20Transaction = async (
  walletClient: WalletClient,
  l1Token: string,
  l2Token: string,
  amount: bigint
) => {
  return await parentClient.simulateContract({
    account: walletClient.account.address,
    address: l1StandardBridge.address,
    abi: l1StandardBridgeAbi,
    functionName: "depositERC20",
    args: [l1Token, l2Token, amount, 0n, toHex(0)],
  });
};

const simulateDepositERC20TransactionOptimism = async (
  walletClient: WalletClient,
  amount: bigint
) => {
  return await parentClient.simulateContract({
    account: walletClient.account.address,
    address: optimismPortal.address,
    abi: optimismPortalAbi,
    functionName: "depositERC20Transaction",
    args: [walletClient.account.address, amount, 0n, 50000n, false, toHex(0)],
  });
};

export const depositTransaction = async (
  walletClient: WalletClient,
  l1Token: string,
  l2Token: string,
  amount: bigint,
  useStandardBridge: boolean
) => {
  if (useStandardBridge) {
    const depositSimulation = await simulateDepositERC20Transaction(
      walletClient,
      l1Token,
      l2Token,
      amount
    );
    const depositHash = await walletClient.writeContract(
      depositSimulation.request
    );
    return await parentClient.waitForTransactionReceipt({
      hash: depositHash,
    });
  } else {
    const depositSimulation = await simulateDepositERC20TransactionOptimism(
      walletClient,
      amount
    );
    const depositHash = await walletClient.writeContract(
      depositSimulation.request
    );
    return await parentClient.waitForTransactionReceipt({
      hash: depositHash,
    });
  }
};
