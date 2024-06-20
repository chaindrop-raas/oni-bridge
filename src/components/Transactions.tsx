import { useWalletClient } from "wagmi";

import { TransactionRow } from "./TransactionRow";
import type { TransactionStore } from "../types";
import { getTransactions } from "../utils";

const ThCell = ({ children }: { children: React.ReactElement | string }) => {
  return (
    <th
      scope="col"
      className="font-normal text-xs text-subdued text-left px-2 py-4"
    >
      {children}
    </th>
  );
};

export const Transactions = ({
  transactionStore,
}: {
  transactionStore: TransactionStore;
}) => {
  const { data: walletClient } = useWalletClient();

  const address = walletClient?.account?.address;
  if (!address) return;

  const transactions = getTransactions(transactionStore, address);
  if (transactions.length === 0) return;

  return (
    <>
      <h3 className="text-xl font-medium">Transactions</h3>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <ThCell>Time</ThCell>
            <ThCell>Type</ThCell>
            <ThCell>Amount</ThCell>
            <ThCell>Status</ThCell>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.transactionHash}
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
