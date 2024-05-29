import { format } from "dnum";
import { useEffect, useState } from "react";
import { defineChain } from "viem";
import { useWalletClient } from "wagmi";
import { parentChain, rollupChain } from "../config";
import { BridgeMode } from "../types";
import {
  useEstimateApproveGas,
  useEstimateDepositGas,
  useEstimateInitiateWithdrawalGas,
} from "../hooks";

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

  const { gas: approveGas } = useEstimateApproveGas({ amount });
  const { gas: depositGas } = useEstimateDepositGas({ amount });
  const { gas: withdrawGas } = useEstimateInitiateWithdrawalGas();

  const timings = {
    deposit: "~1 minute",
    withdraw: "~7 days",
  };

  useEffect(() => {
    if (!walletClient?.account) {
      return;
    }
    const debounce = setTimeout(() => {
      if (mode === "deposit") {
        if (depositApproved) {
          setGasEstimate(depositGas);
        } else {
          setGasEstimate(approveGas);
        }
      } else {
        setGasEstimate(withdrawGas);
      }
    }, 100);
    return () => clearTimeout(debounce);
  }, [
    walletClient,
    amount,
    mode,
    depositApproved,
    approveGas,
    depositGas,
    withdrawGas,
  ]);

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
