import clsx from "clsx";
import { useState } from "react";
import type { WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import { useGetWithdrawalStatus } from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";
import { WithdrawalModal } from "./WithdrawalModal";

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

  const buttonStyle = clsx(
    "border-accent text-accent dark:border-accent-dark dark:text-accent-dark",
    "text-xs rounded-[4px] border w-full py-3"
  );

  const activeButtonStyle = clsx(
    "bg-accent text-accent-foreground",
    buttonStyle
  );

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
    </WithdrawalModal>
  );
};
