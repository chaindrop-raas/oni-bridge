import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useState } from "react";
import { formatEther, type WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import { rollupChain } from "../config";
import {
  useGetWithdrawalStatus,
  useEstimateProveWithdrawalGas,
  useEstimateFinalizeWithdrawalGas,
} from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";
import { CloseIcon, ExternalLinkIcon, WithdrawalStatusIcon } from "./icons";
import { blockExplorerURL } from "../utils";

export const WithdrawalActions = ({
  transaction,
  amount,
}: {
  transaction: WaitForTransactionReceiptReturnType;
  amount: bigint;
}) => {
  const [open, setOpen] = useState(false);
  const { data: walletClient } = useWalletClient();

  const { status } = useGetWithdrawalStatus(transaction);
  const { gas: proveGas } = useEstimateProveWithdrawalGas({
    transactionHash: transaction.transactionHash,
    disabled: status !== "ready-to-prove",
  });

  const { gas: finalizeGas } = useEstimateFinalizeWithdrawalGas({
    transactionHash: transaction.transactionHash,
    disabled: status !== "ready-to-finalize",
  });

  if (
    status === "finalized" ||
    status === "waiting-to-finalize" ||
    status === "waiting-to-prove"
  ) {
    return <p className="font-medium text-xs">{status}</p>;
  }

  const buttonStyle = clsx(
    "border-accent text-accent dark:border-accent-dark dark:text-accent-dark",
    "text-xs rounded-[4px] border w-full py-3"
  );

  const activeButtonStyle = clsx(
    "border-accent bg-accent text-accent-foreground",
    buttonStyle
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={buttonStyle}>
          {status === "ready-to-prove" ? "prove" : "finalize"}
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <Dialog.Title className="font-semibold text-2xl">
            Withdrawal
          </Dialog.Title>
          <Dialog.Close>
            <CloseIcon />
          </Dialog.Close>
        </div>
        <div>
          <div>
            <p className="text-[#9e9ba6] text-base font-normal">
              Amount of withdrawal
            </p>
            <p className="font-medium text-xl">
              {formatEther(amount)} {rollupChain.nativeCurrency.symbol}
            </p>
          </div>
        </div>
        <Dialog.Description asChild>
          <div className="w-96 flex flex-col gap-6">
            <ul className="list-image-[url(/vertical-dashes.svg)] list-inside">
              <li className="flex flex-row justify-between">
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={0} />
                  <p>Initiate Withdrawal</p>
                </div>
                <a
                  href={blockExplorerURL(transaction)}
                  target="_blank"
                  className="text-accent dark:text-accent-dark text-xs flex flex-row gap-1 items-center"
                >
                  See transaction
                  <ExternalLinkIcon />
                </a>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={1} />
                  <p>Wait up to 1 hour</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={2} />
                  <p>Prove Withdrawal</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={3} />
                  <p>Wait 7 days</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={4} />
                  <p>Claim withdrawal</p>
                </div>
              </li>
            </ul>
            <div className="flex flex-row gap-2">
              <Dialog.Close asChild>
                <button className={buttonStyle}>Cancel</button>
              </Dialog.Close>
              {status === "ready-to-prove" && (
                <button
                  className={activeButtonStyle}
                  onClick={() => {
                    if (!walletClient) return;
                    proveWithdrawal(
                      transaction.transactionHash,
                      walletClient.extend(walletActionsL1())
                    ).then(() => setOpen(false));
                  }}
                >
                  Prove withdrawal
                </button>
              )}
              {status === "ready-to-finalize" && (
                <button
                  className={activeButtonStyle}
                  onClick={() => {
                    if (!walletClient) return;
                    finalizeWithdrawal(
                      transaction.transactionHash,
                      walletClient.extend(walletActionsL1())
                    ).then(() => setOpen(false));
                  }}
                >
                  Claim withdrawal
                </button>
              )}
            </div>
            <p className="text-[#9e9ba6] font-normal text-sm text-center">
              You can close this window and reopen it later by clicking on the
              transaction.
            </p>
          </div>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
};
