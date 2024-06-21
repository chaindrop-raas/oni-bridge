import clsx from "clsx";
import { useEffect, useState } from "react";
import type { WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import { parentChain } from "../config";
import { useGetWithdrawalStatus, useIsParentChain } from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";
import { ensureChainSwitch } from "../utils";
import { WithdrawalModal } from "./WithdrawalModal";

const buttonStyle = clsx(
  "text-xs rounded-[4px] border w-full py-3 border-accent text-accent",
  "disabled:bg-grouping disabled:text-faded disabled:border-none disabled:cursor-not-allowed"
);

const WithdrawalButton = ({
  children,
  triggerFn,
}: {
  children: React.ReactNode;
  triggerFn: () => Promise<void>;
}) => {
  const [enabled, setEnabled] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const { isChildChain } = useIsParentChain();
  const { data: walletClient } = useWalletClient();
  const activeButtonStyle = clsx(
    "bg-accent text-accent-fg",
    buttonStyle,
    networkError && "bg-red-400 text-white border-none"
  );

  useEffect(() => {
    if (!walletClient) return;
    if (isChildChain) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
    }
  }, [isChildChain, walletClient]);

  return (
    <button
      disabled={!enabled}
      className={activeButtonStyle}
      onClick={() => {
        if (!walletClient) return;
        setEnabled(false);
        if (isChildChain) {
          ensureChainSwitch(walletClient, parentChain)
            .then(() => {
              setNetworkError(false);
            })
            .finally(() => setEnabled(true));
        } else {
          triggerFn().finally(() => setEnabled(true));
        }
      }}
    >
      {networkError ? `Switch to ${parentChain.name}` : children}
    </button>
  );
};

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

  if (
    status === "finalized" ||
    status === "waiting-to-finalize" ||
    status === "waiting-to-prove"
  ) {
    return <p className="font-medium text-xs">{status}</p>;
  }

  const trigger = (
    <button className={buttonStyle}>
      {status === "ready-to-prove" ? "prove" : "finalize"}
    </button>
  );

  return (
    <WithdrawalModal
      amount={amount}
      open={open}
      setOpen={setOpen}
      status={status}
      transaction={transaction}
      trigger={trigger}
    >
      <div className="flex flex-row gap-2">
        <button className={buttonStyle} onClick={() => setOpen(false)}>
          Cancel
        </button>
        {status !== "initializing" && (
          <WithdrawalButton
            triggerFn={async () => {
              if (!walletClient) return;
              if (status === "ready-to-prove") {
                return proveWithdrawal(
                  transaction.transactionHash,
                  walletClient.extend(walletActionsL1())
                ).then(() => setOpen(false));
              } else if (status === "ready-to-finalize") {
                return finalizeWithdrawal(
                  transaction.transactionHash,
                  walletClient.extend(walletActionsL1())
                ).then(() => setOpen(false));
              }
            }}
          >
            Prove withdrawal
          </WithdrawalButton>
        )}
      </div>
    </WithdrawalModal>
  );
};
