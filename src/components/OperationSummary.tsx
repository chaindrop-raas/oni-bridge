import { format } from "dnum";
import { defineChain, encodeFunctionData } from "viem";
import { useEstimateGas, useWalletClient } from "wagmi";
import { l2ToL1MessagePasserAbi, optimismPortalAbi } from "../abi";
import { BridgeMode } from "../types";

export const OperationSummary = ({
  amount,
  mode,
  targetChain,
}: {
  amount: bigint;
  mode: BridgeMode;
  targetChain: ReturnType<typeof defineChain>;
}) => {
  const { iconUrl, name, nativeCurrency } = targetChain;
  const { symbol, decimals } = nativeCurrency;

  const { data: walletClient } = useWalletClient();

  const addressZero = "0x0000000000000000000000000000000000000000";
  const encodedDepositData = encodeFunctionData({
    abi: optimismPortalAbi,
    functionName: "depositERC20Transaction",
    args: [
      walletClient?.account.address ?? addressZero,
      amount,
      0n,
      50000n,
      false,
      "0x00",
    ],
  });

  const encodedWithdrawData = encodeFunctionData({
    abi: l2ToL1MessagePasserAbi,
    functionName: "initiateWithdrawal",
    args: [walletClient?.account.address ?? addressZero, 50000n, "0x"],
  });

  const { data: gasEstimate, error } = useEstimateGas({
    to: import.meta.env.VITE_L1_OPTIMISM_PORTAL_ADDRESS,
    data: mode === "deposit" ? encodedDepositData : encodedWithdrawData,
  });
  if (error) console.error(error);

  const timings = {
    deposit: "~1 minute",
    withdraw: "~7 days",
  };

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
            {symbol}
          </p>
        </div>
        <div className="flex flex-row justify-between text-xs text-gray-400">
          <p>Gas fee</p>
          <p>
            {format([gasEstimate ?? 0n, decimals])}{" "}
            {walletClient?.chain.nativeCurrency.symbol}
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
