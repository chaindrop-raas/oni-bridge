import { clsx } from "clsx";
import { isAddressEqual, WaitForTransactionReceiptReturnType } from "viem";
import {
  parentClient,
  rollupChain,
  rollupClient,
  token,
  optimismPortal,
} from "../config";

export const TransactionList = ({
  transactions,
}: {
  transactions: WaitForTransactionReceiptReturnType[];
}) => {
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

  const blockExplorerURL = (tx: WaitForTransactionReceiptReturnType) => {
    const label = txLabel(tx);
    switch (label) {
      case "Withdrawal":
        return `${rollupClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
      default:
        return `${parentClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
    }
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {transactions.map((transaction) => (
        <li
          key={transaction.transactionHash}
          className="w-full flex flex-row gap-2 py-2 text-sm"
        >
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
            {txLabel(transaction) === "Withdrawal" && (
              <a
                href="#"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                prove
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
