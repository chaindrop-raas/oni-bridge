import { useEffect, useState } from "react";
import {
  formatEther,
  getAddress,
  parseEventLogs,
  type ParseEventLogsReturnType,
  type WaitForTransactionReceiptReturnType,
} from "viem";
import { useBlock } from "wagmi";

import {
  parentClient,
  rollupChain,
  rollupClient,
  token,
  optimismPortal,
  parentChain,
} from "../config";
import { erc20Abi, l2ToL1MessagePasserAbi, valueEventAbi } from "../abi";
import { titleCase } from "../utils";

type TransactionType = "deposit" | "withdrawal" | "approval" | "unknown";

const txType = (
  transaction: WaitForTransactionReceiptReturnType
): TransactionType => {
  if (!transaction.to) return "unknown";
  switch (getAddress(transaction.to)) {
    case getAddress(rollupChain.contracts.l2ToL1MessagePasser.address):
      return "withdrawal";
    case getAddress(optimismPortal.address):
      return "deposit";
    case getAddress(token.address):
      return "approval";
    default:
      return "unknown";
  }
};

const blockExplorerURL = (tx: WaitForTransactionReceiptReturnType) => {
  const label = txType(tx);
  switch (label) {
    case "withdrawal":
      return `${rollupClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
    default:
      return `${parentClient.chain.blockExplorers.default.url}/tx/${tx.transactionHash}`;
  }
};

const parseLogs = (transaction: WaitForTransactionReceiptReturnType) => {
  switch (txType(transaction)) {
    case "deposit":
      return parseEventLogs({
        abi: erc20Abi,
        eventName: "Transfer",
        logs: transaction.logs,
      });
    case "withdrawal":
      return parseEventLogs({
        abi: l2ToL1MessagePasserAbi,
        eventName: "MessagePassed",
        logs: transaction.logs,
      });
    case "approval":
      return parseEventLogs({
        abi: erc20Abi,
        eventName: "Approval",
        logs: transaction.logs,
      });
  }
};

type ValueEventLogs = ParseEventLogsReturnType<
  typeof valueEventAbi,
  "Event",
  true
>;

const valueFromLogs = (logs: ValueEventLogs) => {
  return formatEther(logs[0].args.value ?? 0n);
};

const formatDate = (timestamp: bigint) => {
  const blockTime = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(blockTime);
};

const formatTime = (timestamp: bigint) => {
  const blockTime = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }).format(blockTime);
};

const TableCell = ({ children }: { children: React.ReactNode }) => {
  return <td className="px-2 py-3">{children}</td>;
};

export const TransactionRow = ({
  transaction,
}: {
  transaction: WaitForTransactionReceiptReturnType;
}) => {
  const transactionLogs = parseLogs(transaction) as unknown as ValueEventLogs;
  const chainId =
    txType(transaction) === "withdrawal" ? rollupChain.id : parentChain.id;
  const { data: block } = useBlock({
    blockHash: transaction.blockHash,
    chainId,
  });
  const [formattedDate, setFormattedDate] = useState<string>("Loading...");
  const [formattedTime, setFormattedTime] = useState<string>("Loading...");

  useEffect(() => {
    if (block) {
      setFormattedDate(formatDate(block.timestamp));
      setFormattedTime(formatTime(block.timestamp));
    }
  }, [block]);

  return (
    <tr className="even:bg-gray-50">
      <TableCell>
        <p className="font-medium text-xs">{formattedDate}</p>
        <p className="font-normal text-xs text-[#9E9BA6]">{formattedTime}</p>
      </TableCell>
      <TableCell>
        <p className="font-medium text-xs">{titleCase(txType(transaction))}</p>
        <p className="font-normal text-xs text-[#9E9BA6]">
          <a
            href={blockExplorerURL(transaction)}
            target="_blank"
            className="underline"
          >
            {transaction.transactionHash.slice(0, 6)}...
            {transaction.transactionHash.slice(-4)}
          </a>
        </p>
      </TableCell>
      <TableCell>
        <p className="font-medium text-xs">
          {valueFromLogs(transactionLogs)} {rollupChain.nativeCurrency.symbol}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-medium text-xs">{transaction.status}</p>
      </TableCell>
    </tr>
  );
};
