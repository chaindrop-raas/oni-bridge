import { clsx } from "clsx";
import { isAddressEqual, WaitForTransactionReceiptReturnType } from "viem";
import { walletActionsL1 } from "viem/op-stack";
import { useWalletClient } from "wagmi";

import {
  parentClient,
  rollupChain,
  rollupClient,
  token,
  optimismPortal,
} from "../config";
import { useGetWithdrawalStatus } from "../hooks";
import { finalizeWithdrawal, proveWithdrawal } from "../txs/withdraw";

const statusColor = (status: string) => {
  switch (status) {
    case "success":
      return "text-green-700 bg-green-50 ring-green-600/20";
    case "reverted":
      return "text-red-700 bg-red-50 ring-red-600/20";
    default:
      return "text-gray-700 bg-gray-50 ring-gray-600/20";
  }
};

const txLabel = (transaction: WaitForTransactionReceiptReturnType) => {
  rollupChain.contracts.l2ToL1MessagePasser;
  if (!transaction.to) {
    return "Unknown";
  } else if (
    isAddressEqual(
      transaction.to,
      rollupChain.contracts.l2ToL1MessagePasser.address
    )
  ) {
    return "Withdrawal";
  } else if (isAddressEqual(transaction.to, optimismPortal.address)) {
    if (rollupClient.chain) {
      return `Deposit to ${rollupClient.chain.name}`;
    } else {
      return "Deposit";
    }
  } else if (isAddressEqual(transaction.to, token.address)) {
    return `Approve for Deposit`;
  } else {
    return "Unknown";
  }
};

const transactionType = (transaction: WaitForTransactionReceiptReturnType) => {
  if (!transaction.to) return "Unknown";

  if (
    isAddressEqual(
      transaction.to,
      rollupChain.contracts.l2ToL1MessagePasser.address
    )
  ) {
    return "withdrawal";
  } else if (isAddressEqual(transaction.to, optimismPortal.address)) {
    return "deposit";
  } else if (isAddressEqual(transaction.to, token.address)) {
    return "approval";
  } else {
    return "unknown";
  }
};

const blockExplorerURL = (tx: WaitForTransactionReceiptReturnType) => {
  const label = txLabel(tx);
  switch (label) {
    case "Withdrawal":
      return `${rollupClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
    default:
      return `${parentClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
  }
};

/**
 * TODO:
 *  1. warn to switch network before attempting if not on parentChain
 *  2. disable button after transaction is submitted
 */

const WithdrawalActions = ({
  transaction,
}: {
  transaction: WaitForTransactionReceiptReturnType;
}) => {
  const { data: walletClient } = useWalletClient();
  const { status } = useGetWithdrawalStatus(transaction);

  return (
    <>
      <p>{status}</p>

      {status === "ready-to-prove" && (
        <button
          onClick={async () => {
            if (!walletClient) return;
            proveWithdrawal(
              transaction.transactionHash,
              walletClient.extend(walletActionsL1())
            );
          }}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          prove
        </button>
      )}
      {status === "ready-to-finalize" && (
        <button
          onClick={async () => {
            if (!walletClient) return;
            finalizeWithdrawal(
              transaction.transactionHash,
              walletClient.extend(walletActionsL1())
            );
          }}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          finalize
        </button>
      )}
    </>
  );
};

export const TransactionListItem = ({
  transaction,
}: {
  transaction: WaitForTransactionReceiptReturnType;
}) => {
  return (
    <>
      <div className="w-full flex flex-col flex-items-start">
        <p className="w-full text-sm font-semibold leading-6 text-gray-900">
          {txLabel(transaction)}
        </p>
        <p
          className={clsx(
            "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs ring-1 ring-inset w-min",
            statusColor(transaction.status)
          )}
        >
          {transaction.status}
        </p>
      </div>
      <div className="w-full text-right content-center">
        <a
          href={blockExplorerURL(transaction)}
          target="_blank"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          view transaction
        </a>
        {transactionType(transaction) === "withdrawal" && (
          <WithdrawalActions transaction={transaction} />
        )}
      </div>
    </>
  );
};
