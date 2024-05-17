import { TransactionReceipt } from "viem";
import { TransactionRow } from "./TransactionRow";

const ThCell = ({ children }: { children: React.ReactElement | string }) => {
  return (
    <th
      scope="col"
      className="font-normal text-xs text-[#9E9BA6] text-left px-2 py-4"
    >
      {children}
    </th>
  );
};

export const Transactions = ({
  transactions,
}: {
  transactions: TransactionReceipt[];
}) => {
  if (transactions.length === 0) {
    return null;
  }

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
