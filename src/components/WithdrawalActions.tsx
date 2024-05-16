import type { WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import { useGetWithdrawalStatus } from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const accentColor = import.meta.env.VITE_BRIDGE_ACCENT_COLOR;
  const accentColorDark = import.meta.env.VITE_BRIDGE_ACCENT_COLOR_DARK;

  return (
    <button
      className={clsx(
        accentColor && `border-[${accentColor}] text-[${accentColor}]`,
        accentColorDark &&
          `dark:border-[${accentColorDark}] dark:text-[${accentColorDark}]`,
        "text-xs rounded-[4px] border w-full py-1"
      )}
      onClick={() => onClick && onClick()}
    >
      {children}
    </button>
  );
};

export const WithdrawalActions = ({
  transaction,
}: {
  transaction: WaitForTransactionReceiptReturnType;
}) => {
  const { data: walletClient } = useWalletClient();
  const { status } = useGetWithdrawalStatus(transaction);
  return (
    <>
      {(status === "finalized" ||
        status === "waiting-to-finalize" ||
        status === "waiting-to-prove") && (
        <p className="font-medium text-xs">{status}</p>
      )}

      {status === "ready-to-prove" && (
        <Button
          onClick={async () => {
            if (!walletClient) return;
            proveWithdrawal(
              transaction.transactionHash,
              walletClient.extend(walletActionsL1())
            );
          }}
        >
          prove
        </Button>
      )}

      {status === "ready-to-finalize" && (
        <Button
          onClick={async () => {
            if (!walletClient) return;
            finalizeWithdrawal(
              transaction.transactionHash,
              walletClient.extend(walletActionsL1())
            );
          }}
        >
          finalize
        </Button>
      )}
    </>
  );
};
