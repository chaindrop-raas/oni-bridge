import { Hex } from "viem";
import { parentClient, rollupChain, rollupClient } from "../config";
import { L1WalletClient, L2WalletClient } from "../types";
import { getWithdrawals } from "viem/op-stack";

export const initiateWithdrawal = async (
  amount: bigint,
  walletClient: L2WalletClient
) => {
  const args = await parentClient.buildInitiateWithdrawal({
    to: walletClient.account.address,
    value: amount,
  });

  const hash = await walletClient.initiateWithdrawal(args);
  return await rollupClient.waitForTransactionReceipt({ hash });
};

export const buildWithdrawalProof = async (initiatingHash: Hex) => {
  const receipt = await rollupClient.getTransactionReceipt({
    hash: initiatingHash,
  });

  const [withdrawal] = getWithdrawals(receipt);
  const output = await parentClient.getL2Output({
    l2BlockNumber: receipt.blockNumber,
    targetChain: rollupChain,
  });

  const proof = await rollupClient.buildProveWithdrawal({
    output,
    withdrawal,
  });

  return { receipt, data: proof };
};

export const proveWithdrawal = async (
  initiatingHash: Hex,
  walletClient: L1WalletClient
) => {
  const { receipt, data: proof } = await buildWithdrawalProof(initiatingHash);

  const status = await parentClient.getWithdrawalStatus({
    receipt,
    targetChain: rollupChain,
  });

  if (status !== "ready-to-prove") {
    throw new Error(`Withdrawal is not ready to prove: ${status}`);
  }

  const hash = await walletClient.proveWithdrawal(proof);
  return await parentClient.waitForTransactionReceipt({ hash });
};

export const buildFinalizeWithdrawal = async (initiatingHash: Hex) => {
  const receipt = await rollupClient.getTransactionReceipt({
    hash: initiatingHash,
  });

  const [withdrawal] = getWithdrawals(receipt);
  return { data: withdrawal, receipt };
};

export const finalizeWithdrawal = async (
  initiatingHash: Hex,
  walletClient: L1WalletClient
) => {
  const { data: withdrawal, receipt } = await buildFinalizeWithdrawal(
    initiatingHash
  );
  const status = await parentClient.getWithdrawalStatus({
    receipt,
    targetChain: rollupChain,
  });

  if (status !== "ready-to-finalize") {
    return {
      error: `Withdrawal is not ready to finalize: ${status}`,
      withdrawal: null,
    };
  }

  const hash = await walletClient.finalizeWithdrawal({
    targetChain: rollupChain,
    withdrawal,
  });

  return await parentClient.waitForTransactionReceipt({ hash });
};
