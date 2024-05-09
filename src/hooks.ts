import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useChainId,
  useReadContract,
  useTransactionReceipt,
  type UseWalletClientReturnType,
} from "wagmi";
import {
  toHex,
  type Hex,
  type WaitForTransactionReceiptReturnType,
} from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import {
  optimismPortal,
  parentClient,
  rollupChain,
  rollupConfig,
  token,
} from "./config";
import { getWithdrawals } from "viem/op-stack";
import { erc20Abi } from "./abi";

export const useIsParentChain = () => {
  const chainId = useChainId();
  return chainId === parentClient.chain.id;
};

export const useCurrentChainBalance = () => {
  const queryClient = useQueryClient();
  const isParentChain = useIsParentChain();
  const account = useAccount();

  const config = isParentChain ? { token: token.address } : {};

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, queryKey } = useBalance({
    ...config,
    address: account.address,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return balance;
};

export const useGetAllowance = (
  walletClient: UseWalletClientReturnType["data"],
  amount: bigint
) => {
  const blockNumber = useBlockNumber();
  const queryClient = useQueryClient();
  const { data: allowance, queryKey } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [walletClient?.account.address ?? toHex(0), optimismPortal.address],
    query: {
      enabled: !!walletClient && amount > 0n,
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  if (allowance) {
    return allowance;
  } else {
    return 0n;
  }
};

export const useTimeToProve = (initiatingHash: Hex) => {
  const [timeToProveDeadline, setTimeToProveDeadline] = useState<number>(0);
  const { data: receipt, isLoading } = useTransactionReceipt({
    hash: initiatingHash,
    config: rollupConfig,
  });

  useEffect(() => {
    const fetchTimeToProve = async () => {
      if (isLoading || !receipt) return;
      const { timestamp } = await parentClient.getTimeToProve({
        receipt,
        targetChain: rollupChain,
      });
      if (timestamp) {
        console.log({ timestamp });
        setTimeToProveDeadline(timestamp);
      }
    };

    fetchTimeToProve();
  }, [receipt, isLoading]);

  return timeToProveDeadline;
};

export type CountdownTimeRemaining = {
  distance: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
};

const calculateTimeRemaining = (
  targetTimestamp: number
): CountdownTimeRemaining => {
  const now = new Date().getTime();
  const distance = targetTimestamp - now;

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  return {
    distance,
    seconds,
    minutes,
    hours,
    days,
  };
};

export const useCountdown = (timestamp: number) => {
  const intervalIdRef = useRef<NodeJS.Timeout>();
  const [timeLeft, setTimeLeft] = useState<CountdownTimeRemaining>({
    distance: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  });

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(timestamp));
    }, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [timestamp]);

  useEffect(() => {
    if (timeLeft.distance <= 0) {
      clearInterval(intervalIdRef.current);
    }
  }, [timeLeft]);

  return timeLeft;
};

export const useTimeToFinalize = (initiatingHash: Hex) => {
  const [timeToFinalize, setTimeToFinalize] = useState<number>(0);
  const { data: receipt, isLoading } = useTransactionReceipt({
    hash: initiatingHash,
    config: rollupConfig,
  });

  useEffect(() => {
    const fetchTimeToProve = async () => {
      if (isLoading || !receipt) return;
      const [message] = getWithdrawals(receipt);
      const { timestamp } = await parentClient.getTimeToFinalize({
        withdrawalHash: message.withdrawalHash,
        targetChain: rollupChain,
      });
      if (timestamp) {
        setTimeToFinalize(timestamp);
      }
    };

    fetchTimeToProve();
  }, [receipt, isLoading]);

  return timeToFinalize;
};

export const useTransactionStorage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializer = (value: any) =>
    JSON.stringify(value, (_, val) =>
      typeof val === "bigint" ? val.toString() + "n" : val
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deserializer = (value: any) =>
    JSON.parse(value, (_, val) =>
      typeof val === "string" && val.endsWith("n")
        ? BigInt(val.slice(0, -1))
        : val
    );

  const [transactions, setTransactions] = useLocalStorage<
    WaitForTransactionReceiptReturnType[]
  >("transactions", [], { serializer, deserializer });

  const addTransaction = (transaction: WaitForTransactionReceiptReturnType) => {
    setTransactions([transaction, ...transactions]);
  };

  console.log({ transactions });

  return { transactions, addTransaction };
};
