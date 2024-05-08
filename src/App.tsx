import { clsx } from "clsx";
import { toNumber } from "dnum";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther, WaitForTransactionReceiptReturnType } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { rollupClient } from "./config";
import { Balance } from "./components/Balance";
import { TransactionList } from "./components/TransactionList";
import { approvalTransaction, depositTransaction } from "./txs/deposit";
import {
  finalizeWithdrawal,
  initiateWithdrawal,
  proveWithdrawal,
} from "./txs/withdraw";
import {
  useCountdown,
  useCurrentChainBalance,
  useGetAllowance,
  useIsParentChain,
  useTimeToFinalize,
  useTimeToProve,
} from "./hooks";
import { formatBalance } from "./utils";
import { walletActionsL1, walletActionsL2 } from "viem/op-stack";

type Inputs = {
  amount: bigint;
};

function App() {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<Inputs>({ defaultValues: { amount: 0n } });
  const amount = parseEther(watch("amount").toString());

  const isParentChain = useIsParentChain();
  const balance = useCurrentChainBalance();
  const account = useAccount();
  const { data: walletClient } = useWalletClient();

  const allowance = useGetAllowance(walletClient, amount);
  const [isApproved, setApproved] = useState(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const [transactions, setTransactions] = useState<
    WaitForTransactionReceiptReturnType[]
  >([]);

  const timeToProve = useTimeToProve(
    "0x69b1aeeb945cb4237e4d88337dac6463b4c3d60b9127e8070c9abe6ed6e5f578"
  );
  const timeLeftToProve = useCountdown(timeToProve);

  const timeToFinalize = useTimeToFinalize(
    "0x69b1aeeb945cb4237e4d88337dac6463b4c3d60b9127e8070c9abe6ed6e5f578"
  );
  const timeLeftToFinalize = useCountdown(timeToFinalize);

  const onSubmit: SubmitHandler<Inputs> = async ({ amount: etherAmount }) => {
    const submittedAmount = parseEther(etherAmount.toString());
    if (!walletClient) return;
    setActionButtonDisabled(true);
    if (isParentChain) {
      const l1WalletClient = walletClient.extend(walletActionsL1());
      if (isApproved) {
        const transaction = await depositTransaction(
          l1WalletClient,
          submittedAmount
        );
        setTransactions((transactions) => [transaction, ...transactions]);
      } else {
        const transaction = await approvalTransaction(
          l1WalletClient,
          submittedAmount
        );
        setTransactions((transactions) => [transaction, ...transactions]);
      }
    } else {
      const l2WalletClient = walletClient.extend(walletActionsL2());
      const transaction = await initiateWithdrawal(
        submittedAmount,
        l2WalletClient
      );
      setTransactions((transactions) => [transaction, ...transactions]);
    }
    setActionButtonDisabled(false);
  };

  useEffect(() => {
    setApproved(allowance >= amount);
    amount === 0n
      ? setActionButtonDisabled(true)
      : setActionButtonDisabled(false);
  }, [amount, allowance]);

  return (
    <div className="flex flex-col gap-6 my-6 items-end">
      <div className="mr-6">
        <ConnectButton
          showBalance={false}
          chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
        />
      </div>
      <div className="mx-auto max-w-96 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{rollupClient.chain.name} Bridge</h1>
        <p className="text-sm text-gray-500">
          Time until provable: {timeLeftToProve.days}d {timeLeftToProve.hours}h{" "}
          {timeLeftToProve.minutes}m {timeLeftToProve.seconds}s
        </p>
        <p className="text-sm text-gray-500">
          Time until finalizable: {timeLeftToFinalize.days}d{" "}
          {timeLeftToFinalize.hours}h {timeLeftToFinalize.minutes}m{" "}
          {timeLeftToFinalize.seconds}s
        </p>
        <form
          className="flex flex-col gap-2 px-4 pt-2 pb-4 border border-gray-300 rounded-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label
            htmlFor="amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Amount
          </label>
          <div className="flex flex-row gap-2 items-center">
            <div className="relative rounded-md shadow-sm flex-grow">
              <input
                type="number"
                step="any"
                id="amount"
                min={0}
                placeholder="0"
                className={clsx(
                  "block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                  errors.amount &&
                    "text-red-900 focus:ring-red-500 ring-red-300 placeholder:text-red-300 "
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
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:focus-visible:outline-2 disabled:focus-visible:outline-offset-2 disabled:focus-visible:outline-gray-300"
            disabled={!account.isConnected || actionButtonDisabled}
          >
            {isParentChain ? (isApproved ? "Deposit" : "Approve") : "Withdraw"}
          </button>
        </form>
        <button
          onClick={async () => {
            if (!walletClient) return;
            const extendedClient = walletClient.extend(walletActionsL1());
            proveWithdrawal(
              "0x69b1aeeb945cb4237e4d88337dac6463b4c3d60b9127e8070c9abe6ed6e5f578",
              extendedClient
            );
          }}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          prove
        </button>
        <button
          onClick={async () => {
            if (!walletClient) return;
            const extendedClient = walletClient.extend(walletActionsL1());
            finalizeWithdrawal(
              "0x69b1aeeb945cb4237e4d88337dac6463b4c3d60b9127e8070c9abe6ed6e5f578",
              extendedClient
            );
          }}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          finalize
        </button>
      </div>
      <div className="w-full max-w-96 m-auto">
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}

export default App;
