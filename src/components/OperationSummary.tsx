import { defineChain, encodeFunctionData } from "viem";
import { format } from "dnum";
import { useEstimateGas, useWalletClient } from "wagmi";
import { optimismPortalAbi } from "../abi";

export const OperationSummary = ({
  amount,
  targetChain,
}: {
  amount: bigint;
  targetChain: ReturnType<typeof defineChain>;
}) => {
  const { iconUrl, name, nativeCurrency } = targetChain;
  const { symbol, decimals } = nativeCurrency;

  const { data: walletClient } = useWalletClient();

  /**
   * TODO:
   * - handle summary for Withdrawal as well
   *   - encodeFunctionData for withdraw
   *   - useEstimateGas for withdraw
   *   - time to transfer for withdraw depending on phase
   */

  const encodedDepositData = encodeFunctionData({
    abi: optimismPortalAbi,
    functionName: "depositERC20Transaction",
    args: [
      walletClient?.account.address ??
        "0x0000000000000000000000000000000000000000",
      amount,
      0n,
      50000n,
      false,
      "0x00",
    ],
  });

  const { data: gasEstimate, error } = useEstimateGas({
    to: import.meta.env.VITE_L1_OPTIMISM_PORTAL_ADDRESS,
    data: encodedDepositData,
  });
  if (error) console.error(error);

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
          <p>~1 minute</p>
        </div>
      </div>
    </div>
  );
};
