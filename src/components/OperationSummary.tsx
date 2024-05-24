import { format } from "dnum";
import { useEffect, useState } from "react";
import { Account, defineChain, encodeFunctionData, erc20Abi } from "viem";
import { useWalletClient } from "wagmi";
import { l2ToL1MessagePasserAbi, optimismPortalAbi } from "../abi";
import {
  optimismPortal,
  parentChain,
  parentClient,
  rollupChain,
  rollupClient,
  token,
} from "../config";
import { BridgeMode } from "../types";

const encodeApproveData = (amount: bigint) => {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: "approve",
    args: [optimismPortal.address, amount],
  });
};

const encodeDepositData = (account: Account, amount: bigint) => {
  return encodeFunctionData({
    abi: optimismPortalAbi,
    functionName: "depositERC20Transaction",
    args: [account.address, amount, 0n, 50000n, false, "0x00"],
  });
};

const estimateDepositGas = async ({
  amount,
  account,
  depositApproved,
}: {
  account: Account;
  amount: bigint;
  depositApproved: boolean;
}) => {
  if (depositApproved) {
    return await parentClient.estimateGas({
      account: account,
      value: amount,
      to: optimismPortal.address,
      data: encodeDepositData(account, amount),
    });
  } else {
    return await parentClient.estimateGas({
      account: account,
      to: token.address,
      data: encodeApproveData(amount),
    });
  }
};

const estimateWithdrawGas = async ({ account }: { account: Account }) => {
  return await rollupClient.estimateGas({
    account: account,
    to: rollupChain.contracts.l2ToL1MessagePasser.address,
    data: encodeFunctionData({
      abi: l2ToL1MessagePasserAbi,
      functionName: "initiateWithdrawal",
      args: [account.address, 50000n, "0x"],
    }),
  });
};

const getGasEstimate = async ({
  amount,
  account,
  depositApproved,
  mode,
}: {
  account: Account;
  amount: bigint;
  depositApproved: boolean;
  mode: BridgeMode;
}) => {
  if (mode === "deposit") {
    return estimateDepositGas({ amount, account, depositApproved });
  } else {
    return estimateWithdrawGas({ account });
  }
};

export const OperationSummary = ({
  amount,
  mode,
  targetChain,
  depositApproved,
}: {
  amount: bigint;
  mode: BridgeMode;
  targetChain: ReturnType<typeof defineChain>;
  depositApproved: boolean;
}) => {
  const { iconUrl, name, nativeCurrency } = targetChain;
  const gasChain = mode === "deposit" ? parentChain : rollupChain;
  const { decimals } = nativeCurrency;

  const { data: walletClient } = useWalletClient();

  const [gasEstimate, setGasEstimate] = useState<bigint | void>();

  const timings = {
    deposit: "~1 minute",
    withdraw: "~7 days",
  };

  useEffect(() => {
    if (!walletClient?.account) {
      return;
    }
    getGasEstimate({
      account: walletClient.account,
      amount,
      depositApproved,
      mode,
    }).then((estimate) => {
      setGasEstimate(estimate);
    });
  }, [walletClient, amount, mode, depositApproved]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-medium">Summary</h3>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between text-sm mb-3">
          <div className="flex flex-row gap-1 font-medium">
            <p>Receive on</p>
            <img src={iconUrl} width={16} height={16} alt={name} />
            <p>{name}</p>
          </div>
          <p className="">
            {format([amount, decimals], {
              digits: 4,
            })}{" "}
            {rollupChain.nativeCurrency.symbol}
          </p>
        </div>
        <div className="flex flex-row justify-between text-xs text-gray-400">
          <p>Gas fee</p>
          <p>
            {format([gasEstimate ?? 0n, decimals])}{" "}
            {gasChain.nativeCurrency.symbol}
          </p>
        </div>
        <div className="flex flex-row justify-between text-xs text-gray-400">
          <p>Time to transfer</p>
          <p>{timings[mode]}</p>
        </div>
      </div>
    </div>
  );
};
