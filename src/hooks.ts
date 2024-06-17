import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useChainId,
  useReadContract,
  useTransactionReceipt,
  useWalletClient,
  type UseWalletClientReturnType,
} from "wagmi";
import {
  encodeFunctionData,
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
import {
  getWithdrawals,
  publicActionsL1,
  publicActionsL2,
} from "viem/op-stack";
import { erc20Abi, optimismPortalAbi } from "./abi";
import { StatusReturnType } from "./types";
import { buildFinalizeWithdrawal, buildWithdrawalProof } from "./txs/withdraw";
import { isCustomGasToken } from "./utils";

export const useIsParentChain = () => {
  const chainId = useChainId();
  return {
    isParentChain: chainId === parentClient.chain.id,
    isChildChain: chainId === rollupChain.id,
  };
};

export const useCurrentChainBalance = () => {
  const queryClient = useQueryClient();
  const { isParentChain } = useIsParentChain();
  const account = useAccount();

  const config =
    isParentChain && isCustomGasToken() ? { token: token.address } : {};

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

export const useGetWithdrawalStatus = (
  transaction: WaitForTransactionReceiptReturnType
): {
  isLoading: boolean;
  status: StatusReturnType;
} => {
  const [status, setStatus] = useState<StatusReturnType>("retrieving-status");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const withdrawalStatus = await parentClient.getWithdrawalStatus({
        receipt: transaction,
        targetChain: rollupChain,
      });
      setStatus(withdrawalStatus);
      setIsLoading(false);
    };
    fetchStatus();
  }, [transaction]);

  return { isLoading, status };
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

  return { transactions, addTransaction };
};

export const useEstimateApproveGas = ({ amount }: { amount: bigint }) => {
  const { data: walletClient } = useWalletClient({
    chainId: parentClient.chain.id,
  });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [gas, setGas] = useState<bigint>(0n);

  useEffect(() => {
    const fetchGas = async () => {
      if (!walletClient) return;
      const account = walletClient.account;
      await parentClient
        .estimateGas({
          account,
          to: token.address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [optimismPortal.address, amount],
          }),
        })
        .then(setGas)
        .catch(() => {
          setStatus("error");
        });
      setStatus("success");
    };
    fetchGas();
  }, [walletClient, amount]);

  return { status, gas };
};

export const useEstimateDepositGas = ({ amount }: { amount: bigint }) => {
  const { data: walletClient } = useWalletClient({
    chainId: parentClient.chain.id,
  });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [gas, setGas] = useState<bigint>(0n);

  useEffect(() => {
    const fetchGas = async () => {
      if (!walletClient) return;
      const account = walletClient.account;
      await parentClient
        .estimateGas({
          account,
          data: encodeFunctionData({
            abi: optimismPortalAbi,
            functionName: isCustomGasToken()
              ? "depositERC20Transaction"
              : "depositTransaction",
            args: isCustomGasToken()
              ? [account.address, amount, 0n, 50000n, false, account.address]
              : [account.address, amount, 50000n, false, account.address],
          }),
          to: optimismPortal.address,
          value: isCustomGasToken() ? 0n : amount,
        })
        .then(setGas)
        .catch(() => {
          setStatus("error");
        });
      setStatus("success");
    };
    fetchGas();
  }, [walletClient, amount]);

  return { status, gas };
};

export const useEstimateInitiateWithdrawalGas = () => {
  const { data: walletClient } = useWalletClient({ chainId: rollupChain.id });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [gas, setGas] = useState<bigint>(0n);

  useEffect(() => {
    const fetchGas = async () => {
      if (!walletClient) return;
      await walletClient
        .extend(publicActionsL2())
        .estimateInitiateWithdrawalGas({
          account: walletClient.account.address,
          request: {
            gas: 21000n,
            to: walletClient.account.address,
          },
        })
        .then((estimatedGas) => setGas(estimatedGas))
        .catch(() => {
          setStatus("error");
        });
      setStatus("success");
    };
    fetchGas();
  }, [walletClient]);

  return { status, gas };
};

export const useEstimateProveWithdrawalGas = ({
  transactionHash,
  disabled,
}: {
  transactionHash: Hex;
  disabled?: boolean;
}) => {
  const { data: walletClient } = useWalletClient({
    chainId: parentClient.chain.id,
  });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [gas, setGas] = useState<bigint>(0n);

  useEffect(() => {
    const fetchGas = async () => {
      if (!walletClient || disabled) return;
      const { data: proof } = await buildWithdrawalProof(transactionHash);
      await walletClient
        .extend(publicActionsL1())
        .estimateProveWithdrawalGas({
          account: walletClient.account.address,
          targetChain: rollupChain,
          l2OutputIndex: proof.l2OutputIndex,
          outputRootProof: proof.outputRootProof,
          withdrawalProof: proof.withdrawalProof,
          withdrawal: proof.withdrawal,
        })
        .then((estimatedGas) => setGas(estimatedGas))
        .catch(() => {
          setStatus("error");
        });
      setStatus("success");
    };
    fetchGas();
  }, [disabled, transactionHash, walletClient]);

  return { status, gas };
};

export const useEstimateFinalizeWithdrawalGas = ({
  transactionHash,
  disabled,
}: {
  transactionHash: Hex;
  disabled?: boolean;
}) => {
  const { data: walletClient } = useWalletClient({
    chainId: parentClient.chain.id,
  });
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [gas, setGas] = useState<bigint>(0n);

  useEffect(() => {
    const fetchGas = async () => {
      if (!walletClient || disabled) return;
      const { data: withdrawal } = await buildFinalizeWithdrawal(
        transactionHash
      );
      await walletClient
        .extend(publicActionsL1())
        .estimateFinalizeWithdrawalGas({
          account: walletClient.account.address,
          targetChain: rollupChain,
          withdrawal,
        })
        .then((estimatedGas) => setGas(estimatedGas))
        .catch(() => {
          setStatus("error");
        });
      setStatus("success");
    };
    fetchGas();
  }, [disabled, transactionHash, walletClient]);

  return { status, gas };
};
