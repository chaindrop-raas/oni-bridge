import { toHex } from "viem";

import { erc20Abi, optimismPortalAbi } from "../abi";
import { parentClient, token, optimismPortal, rollupChain } from "../config";
import { WalletClient, L1WalletClient } from "../types";
import { isCustomGasToken } from "../utils";

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

const simulateCustomTokenDepositTransaction = async (
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
  walletClient: L1WalletClient,
  amount: bigint
) => {
  if (isCustomGasToken()) {
    const depositSimulation = await simulateCustomTokenDepositTransaction(
      walletClient,
      amount
    );
    const hash = await walletClient.writeContract(depositSimulation.request);
    return await parentClient.waitForTransactionReceipt({ hash });
  } else {
    const hash = await walletClient.depositTransaction({
      account: walletClient.account.address,
      request: {
        mint: amount,
        to: walletClient.account.address,
        gas: 50000n,
      },
      targetChain: rollupChain,
    });
    return await parentClient.waitForTransactionReceipt({ hash });
  }
};
