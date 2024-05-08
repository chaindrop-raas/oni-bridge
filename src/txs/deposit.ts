import { toHex } from "viem";

import { erc20Abi, optimismPortalAbi } from "../abi";
import { parentClient, token, optimismPortal } from "../config";
import { WalletClient } from "../types";

const simulateApproveTransaction = async (
  walletClient: WalletClient,
  amount: bigint
) => {
  return await parentClient.simulateContract({
    account: walletClient.account.address,
    address: token.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [optimismPortal.address, amount],
  });
};

export const approvalTransaction = async (
  walletClient: WalletClient,
  amount: bigint
) => {
  const approvalSimulation = await simulateApproveTransaction(
    walletClient,
    amount
  );
  const approvalHash = await walletClient.writeContract(
    approvalSimulation.request
  );
  return await parentClient.waitForTransactionReceipt({
    hash: approvalHash,
  });
};
const simulateDepositTransaction = async (
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
  amount: bigint
) => {
  const depositSimulation = await simulateDepositTransaction(
    walletClient,
    amount
  );
  const depositHash = await walletClient.writeContract(
    depositSimulation.request
  );
  return await parentClient.waitForTransactionReceipt({
    hash: depositHash,
  });
};
