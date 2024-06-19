import clsx from "clsx";
import { useState } from "react";
import type { WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import { useGetWithdrawalStatus } from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";
import { WithdrawalModal } from "./WithdrawalModal";

const buttonStyle = clsx(
  "text-xs rounded-[4px] border w-full py-3 border-accent text-accent",
  "disabled:bg-grouping disabled:text-faded disabled:border-none disabled:cursor-not-allowed"
);

const activeButtonStyle = clsx("bg-accent text-accent-fg", buttonStyle);

const WithdrawalButton = ({
  children,
  triggerFn,
}: {
  children: React.ReactNode;
  triggerFn: () => Promise<void>;
}) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <button
      disabled={!enabled}
      className={activeButtonStyle}
      onClick={() => {
        setEnabled(false);
        triggerFn().finally(() => setEnabled(true));
      }}
    >
      {children}
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
        {status === "ready-to-prove" && (
          <WithdrawalButton
            triggerFn={async () => {
              if (!walletClient) return;
              return proveWithdrawal(
                transaction.transactionHash,
                walletClient.extend(walletActionsL1())
              ).then(() => setOpen(false));
            }}
          >
            Prove withdrawal
          </WithdrawalButton>
        )}
        {status === "ready-to-finalize" && (
          <WithdrawalButton
            triggerFn={async () => {
              if (!walletClient) return;
              return finalizeWithdrawal(
                transaction.transactionHash,
                walletClient.extend(walletActionsL1())
              ).then(() => setOpen(false));
            }}
          >
            Claim withdrawal
          </WithdrawalButton>
        )}
      </div>
    </WithdrawalModal>
  );
};
