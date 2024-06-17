import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  formatEther,
  parseEventLogs,
  type ParseEventLogsReturnType,
  type WaitForTransactionReceiptReturnType,
} from "viem";
import { useBlock, useTransaction } from "wagmi";

import {
  erc20Abi,
  l2ToL1MessagePasserAbi,
  optimismPortalAbi,
  valueEventAbi,
} from "../abi";
import { rollupChain, parentChain } from "../config";
import {
  titleCase,
  txType,
  blockExplorerURL,
  isCustomGasToken,
} from "../utils";
import { WithdrawalActions } from "./WithdrawalActions";
import { WithdrawalProgressIcon } from "./icons/WithdrawalProgress";

const parseLogs = (transaction: WaitForTransactionReceiptReturnType) => {
  switch (txType(transaction)) {
    case "deposit":
      if (isCustomGasToken()) {
        return parseEventLogs({
          abi: erc20Abi,
          eventName: "Transfer",
          logs: transaction.logs,
        });
      } else {
        return parseEventLogs({
          abi: optimismPortalAbi,
          eventName: "TransactionDeposited",
          logs: transaction.logs,
        });
      }
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
  return logs[0].args.value ?? 0n;
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

const TableCell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <td className={clsx("px-2 py-3", className)}>{children}</td>;
};

const TransactionStatus = ({
  transaction,
  amount,
}: {
  transaction: WaitForTransactionReceiptReturnType;
  amount: bigint;
}) => {
  if (transaction.status === "reverted") {
    return <p className="font-medium text-xs">Reverted</p>;
  }
  if (txType(transaction) === "withdrawal") {
    return <WithdrawalActions transaction={transaction} amount={amount} />;
  }
  return <p className="font-medium text-xs">{transaction.status}</p>;
};

export const TransactionRow = ({
  transaction,
}: {
  transaction: WaitForTransactionReceiptReturnType;
}) => {
  const transactionLogs = parseLogs(transaction) as unknown as ValueEventLogs;
  const transactionType = txType(transaction);
  const chainId =
    transactionType === "withdrawal" ? rollupChain.id : parentChain.id;
  const { data: block } = useBlock({
    blockHash: transaction.blockHash,
    chainId,
  });
  const [formattedDate, setFormattedDate] = useState<string>("Loading...");
  const [formattedTime, setFormattedTime] = useState<string>("Loading...");
  const [formattedAmount, setFormattedAmount] = useState<string>("Loading...");

  const { data } = useTransaction({
    hash: transaction.transactionHash,
    chainId,
    query: {
      enabled: !isCustomGasToken(),
    },
  });

  useEffect(() => {
    if (block) {
      setFormattedDate(formatDate(block.timestamp));
      setFormattedTime(formatTime(block.timestamp));
      if (isCustomGasToken()) {
        setFormattedAmount(
          `${formatEther(valueFromLogs(transactionLogs))} ${
            rollupChain.nativeCurrency.symbol
          }`
        );
      } else {
        setFormattedAmount(
          `${formatEther(data?.value ?? 0n)} ${
            rollupChain.nativeCurrency.symbol
          }`
        );
      }
    }
  }, [block, data, transactionLogs]);

  return (
    <tr className="">
      <TableCell className="flex flex-row gap-2 items-center">
        {transactionType === "withdrawal" && (
          <WithdrawalProgressIcon transaction={transaction} />
        )}
        <div>
          <p className="font-medium text-xs">{formattedDate}</p>
          <p className="font-normal text-xs text-subdued">{formattedTime}</p>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium text-xs">{titleCase(txType(transaction))}</p>
        <p className="font-normal text-xs text-subdued">
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
        <p className="font-medium text-xs">{formattedAmount}</p>
      </TableCell>
      <TableCell>
        <TransactionStatus
          transaction={transaction}
          amount={valueFromLogs(transactionLogs)}
        />
      </TableCell>
    </tr>
  );
};
