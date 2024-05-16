import { clsx } from "clsx";
import { toNumber } from "dnum";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import {
  parentChain,
  rollupChain,
  rollupClient,
  uiConfig as ui,
} from "./config";
import { Balance } from "./components/Balance";
import { TransactionRow } from "./components/TransactionRow";
import { approvalTransaction, depositTransaction } from "./txs/deposit";
import { initiateWithdrawal } from "./txs/withdraw";
import {
  useCurrentChainBalance,
  useGetAllowance,
  useTransactionStorage,
} from "./hooks";
import type { BridgeMode, WalletClient } from "./types";
import { formatBalance } from "./utils";
import { walletActionsL1, walletActionsL2 } from "viem/op-stack";
import { BridgeDirection } from "./components/BridgeDirection";
import { OperationSummary } from "./components/OperationSummary";
import { ActionButton } from "./components/ActionButton";

type Inputs = {
  amount: bigint;
};

const Th = ({ children }: { children: React.ReactElement | string }) => {
  return (
    <th
      scope="col"
      className="font-normal text-xs text-[#9E9BA6] text-left px-2 py-4"
    >
      {children}
    </th>
  );
};

function App() {
  const balance = useCurrentChainBalance();
  const account = useAccount();
  const { data: walletClient } = useWalletClient();

  const [isApproved, setApproved] = useState(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const [bridgeMode, setBridgeMode] = useState<BridgeMode>("deposit");
  const { transactions, addTransaction } = useTransactionStorage();

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<Inputs>({ defaultValues: { amount: 0n } });
  const amount = parseEther(watch("amount").toString());
  const allowance = useGetAllowance(walletClient, amount);

  const approvalFn = async (walletClient: WalletClient, amount: bigint) => {
    const l1WalletClient = walletClient.extend(walletActionsL1());
    const transaction = await approvalTransaction(l1WalletClient, amount);
    addTransaction(transaction);
  };

  const depositFn = async (walletClient: WalletClient, amount: bigint) => {
    const l1WalletClient = walletClient.extend(walletActionsL1());
    const transaction = await depositTransaction(l1WalletClient, amount);
    addTransaction(transaction);
  };

  const withdrawFn = async (walletClient: WalletClient, amount: bigint) => {
    const l2WalletClient = walletClient.extend(walletActionsL2());
    const transaction = await initiateWithdrawal(amount, l2WalletClient);
    addTransaction(transaction);
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ amount: etherAmount }) => {
    const submittedAmount = parseEther(etherAmount.toString());
    if (!walletClient) return;
    if (!account.isConnected) return;
    setActionButtonDisabled(true);
    try {
      if (bridgeMode === "deposit") {
        if (isApproved) {
          await approvalFn(walletClient, submittedAmount);
        } else {
          await depositFn(walletClient, submittedAmount);
        }
      } else if (bridgeMode === "withdraw") {
        await withdrawFn(walletClient, submittedAmount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionButtonDisabled(false);
    }
  };

  const handleTabClick =
    (mode: BridgeMode) => async (event: React.MouseEvent) => {
      event.preventDefault();
      setBridgeMode(mode);
      console.log(mode);
    };

  const classesForTab = (mode: BridgeMode) => {
    return clsx(
      "w-1/2 border-b-2 text-center text-xl py-2",
      bridgeMode === mode && ui.accentColor
        ? `border-[${ui.accentColor}]`
        : "border-gray text-gray-400 hover:border-gray-300 hover:text-gray-700",
      bridgeMode === mode &&
        ui.accentColorDark &&
        `dark:border-[${ui.accentColorDark}]`
    );
  };

  const targetChain = bridgeMode === "deposit" ? rollupChain : parentChain;

  useEffect(() => {
    setApproved(allowance >= amount);
    amount === 0n
      ? setActionButtonDisabled(true)
      : setActionButtonDisabled(false);
  }, [amount, allowance]);

  return (
    <div className="flex flex-col gap-6 my-6">
      <div className="flex flex-row justify-between px-6">
        <div className="">
          <img src={ui.logoUrl} alt="logo" width={40} height={40} />
        </div>
        <div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
      <div className="mx-auto lg:w-[488px] flex flex-col gap-4">
        <nav className="flex flex-row gap-1 items-center" aria-label="Tabs">
          <a
            href="#"
            className={classesForTab("deposit")}
            aria-selected={bridgeMode === "deposit" ? "true" : "false"}
            onClick={handleTabClick("deposit")}
          >
            Deposit
          </a>
          <a
            href="#"
            className={classesForTab("withdraw")}
            onClick={handleTabClick("withdraw")}
          >
            Withdraw
          </a>
        </nav>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 rounded-xl bg-[#fafafa] px-8 pt-6 pb-8">
            <BridgeDirection />
            <div className="flex flex-row gap-2 items-center pt-6">
              <div className="relative rounded-md shadow-sm flex-grow">
                <input
                  type="number"
                  step="any"
                  id="amount"
                  min={0}
                  placeholder="0.0"
                  className={clsx(
                    "block w-full rounded-lg border-[#D2D1D4] border-2 text-3xl placeholder:text-[#D2D1D4]",
                    errors.amount && "text-red-900"
                  )}
                  aria-invalid={errors.amount ? "true" : "false"}
                  aria-describedby="amount-error"
                  {...register("amount", {
                    required: true,
                    min: toNumber([1n, 18]),
                    max: toNumber([balance?.value ?? 0n, 18]),
                  })}
                />
                {errors.amount && (
                  <>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
                      <svg
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </div>
              <p>{rollupClient.chain.nativeCurrency.symbol}</p>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600" id="amount-error">
                Amount must be between 0 and{" "}
                {formatBalance(balance?.value ?? 0n, balance?.decimals ?? 18)}{" "}
                {rollupClient.chain.nativeCurrency.symbol}
              </p>
            )}
            <Balance amount={balance} />
          </div>
          <div className="flex flex-col gap-4 rounded-xl bg-[#fafafa] px-8 pt-6 pb-8">
            <OperationSummary
              amount={amount}
              mode={bridgeMode}
              targetChain={targetChain}
            />
            <ActionButton
              mode={bridgeMode}
              withdrawalApproved={isApproved}
              disabled={!account.isConnected || actionButtonDisabled}
            />
          </div>
        </form>
      </div>
      <div className="w-full lg:w-[488px] m-auto flex flex-col gap-4">
        <h3 className="text-xl font-medium">Transactions</h3>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
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
      </div>
    </div>
  );
}

export default App;
