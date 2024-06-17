import { clsx } from "clsx";
import { toNumber } from "dnum";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { parentChain, rollupChain, rollupClient } from "./config";
import { Balance } from "./components/Balance";
import { approvalTransaction, depositTransaction } from "./txs/deposit";
import { initiateWithdrawal } from "./txs/withdraw";
import {
  useCurrentChainBalance,
  useGetAllowance,
  useIsParentChain,
  useTransactionStorage,
} from "./hooks";
import type { BridgeMode, WalletClient } from "./types";
import { formatBalance, isCustomGasToken } from "./utils";
import { walletActionsL1, walletActionsL2 } from "viem/op-stack";
import { BridgeDirection } from "./components/BridgeDirection";
import { OperationSummary } from "./components/OperationSummary";
import { ActionButton } from "./components/ActionButton";
import { Transactions } from "./components/Transactions";
import { Tabs } from "./components/Tabs";
import { DepositModal } from "./components/DepositModal";
import { WithdrawalModal } from "./components/WithdrawalModal";

type Inputs = {
  amount: bigint;
};

function App() {
  const balance = useCurrentChainBalance();
  const account = useAccount();
  const { data: walletClient } = useWalletClient();

  const [isApproved, setApproved] = useState(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalButtonEnabled, setWithdrawalButtonEnabled] = useState(true);
  const [acknowledgementOne, setAcknowledgementOne] = useState(false);
  const [acknowledgementTwo, setAcknowledgementTwo] = useState(false);
  const [bridgeMode, setBridgeMode] = useState<BridgeMode>("deposit");
  const { transactions, addTransaction } = useTransactionStorage();
  const { isParentChain, isChildChain } = useIsParentChain();

  const logoUrl = import.meta.env.VITE_BRIDGE_LOGO_URL;

  const handleWithdrawalModalToggle = (isOpen: boolean) => {
    setShowWithdrawalModal(isOpen);
    if (!isOpen) {
      setAcknowledgementOne(false);
      setAcknowledgementTwo(false);
    }
  };

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
      if (bridgeMode === "deposit" && isParentChain) {
        // if the chain does not use a custom gas token or if it does and the
        // amount is approved, show the deposit modal
        if (!isCustomGasToken() || isApproved) {
          setShowDepositModal(true);
        } else {
          await approvalFn(walletClient, submittedAmount);
        }
      } else if (bridgeMode === "withdraw" && isChildChain) {
        handleWithdrawalModalToggle(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionButtonDisabled(false);
    }
  };

  const targetChain = bridgeMode === "deposit" ? rollupChain : parentChain;

  useEffect(() => {
    setApproved(!isCustomGasToken() || (amount > 0n && allowance >= amount));
    amount === 0n
      ? setActionButtonDisabled(true)
      : setActionButtonDisabled(false);
  }, [amount, allowance]);

  return (
    <div className="flex flex-col justify-between bg-base text-foreground min-h-svh">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between lg:pt-6 lg:px-6 lg:pb-6 pt-4 px-4">
          <img src={logoUrl} alt="logo" width={40} height={40} />
          <ConnectButton showBalance={false} />
        </div>
        <div className="flex flex-col gap-4 text-foreground">
          <div className="flex flex-col gap-1">
            <form
              className="flex flex-col gap-1 max-w-screen-body lg:w-[488px] mx-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Tabs bridgeMode={bridgeMode} setBridgeMode={setBridgeMode} />
              <div className="flex flex-col gap-6 rounded-xl lg:bg-grouping lg:px-8 px-4 pt-6 pb-8">
                <BridgeDirection />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 justify-between p-1 rounded-lg bg-base text-foreground border-faded border-2">
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        id="amount"
                        min={0}
                        placeholder="0.0"
                        className={clsx(
                          "w-full text-3xl placeholder:text-faded border-none bg-inherit focus:ring-0",
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
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
                          <svg
                            className="h-5 w-5 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              clipRule="evenodd"
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="flex-none self-center pr-4">
                      {rollupClient.chain.nativeCurrency.symbol}
                    </p>
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-600" id="amount-error">
                      Amount must be between 0 and{" "}
                      {formatBalance(
                        balance?.value ?? 0n,
                        balance?.decimals ?? 18
                      )}{" "}
                      {rollupClient.chain.nativeCurrency.symbol}
                    </p>
                  )}
                  <Balance amount={balance} />
                </div>
              </div>
            </form>

            <div className="flex flex-col-reverse lg:flex-col gap-6 divide-y divide-solid lg:divide-none">
              <div
                className={clsx(
                  "flex flex-col gap-4 text-foreground lg:px-8 px-4 pt-6 pb-8",
                  "sticky bottom-0 left-0 right-0 lg:static w-full lg:max-w-screen-body lg:w-[488px] m-auto",
                  "lg:rounded-xl bg-grouping"
                )}
              >
                <OperationSummary
                  amount={amount}
                  mode={bridgeMode}
                  depositApproved={isApproved}
                  targetChain={targetChain}
                />
                <ActionButton
                  mode={bridgeMode}
                  depositApproved={isApproved}
                  disabled={!account.isConnected || actionButtonDisabled}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </div>
              <div className="w-full m-auto max-w-screen-body flex flex-col gap-4 px-2 pt-6 lg:pt-0">
                <Transactions transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-xxs text-faded flex-row gap-2 items-center justify-items-start px-14 hidden lg:flex">
        <img
          src="/images/chaindrop-logo-grayscale.svg"
          alt="powered by Chaindrop"
          width={20}
          height={20}
        />
        <div className="flex flex-col gap-0">
          <p>
            Powered by <a href="https://www.chaindrop.com/">Chaindrop</a>
          </p>
          <p>
            Licensed under{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              CC BY-SA 4.0
            </a>
          </p>
        </div>
      </footer>

      <DepositModal
        amount={amount}
        open={showDepositModal}
        setOpen={setShowDepositModal}
        triggerDeposit={() => {
          return depositFn(walletClient as WalletClient, amount);
        }}
      />
      <WithdrawalModal
        amount={amount}
        open={showWithdrawalModal}
        setOpen={handleWithdrawalModalToggle}
        status="initializing"
      >
        <div className="flex flex-row gap-2 items-start">
          <input
            type="checkbox"
            checked={acknowledgementOne}
            className="mt-1"
            onChange={() => setAcknowledgementOne(!acknowledgementOne)}
          />
          <p className="md:text-sm text-xs text-subdued">
            I understand it will take ~7 days until my funds are claimable on{" "}
            {parentChain.name}.
          </p>
        </div>
        <div className="flex flex-row gap-2 items-start">
          <input
            type="checkbox"
            checked={acknowledgementTwo}
            className="mt-1"
            onChange={() => setAcknowledgementTwo(!acknowledgementTwo)}
          />
          <p className="md:text-sm text-xs text-subdued">
            I understand the ~7 day timer does not start until I prove my
            withdrawal.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <button
            className="border-accent text-accent dark:border-accent-dark dark:text-accent-dark text-xs rounded-[4px] border w-full py-3"
            onClick={() => {
              handleWithdrawalModalToggle(false);
            }}
          >
            Cancel
          </button>
          <button
            disabled={
              !(acknowledgementOne && acknowledgementTwo) ||
              !withdrawalButtonEnabled
            }
            className={clsx(
              "border-accent text-accent dark:border-accent-dark dark:text-accent-dark bg-accent text-accent-fg text-xs rounded-[4px] border w-full py-3",
              "disabled:bg-grouping disabled:text-faded disabled:border-none disabled:cursor-not-allowed"
            )}
            onClick={() => {
              setWithdrawalButtonEnabled(false);
              withdrawFn(walletClient as WalletClient, amount)
                .then(() => {
                  handleWithdrawalModalToggle(false);
                })
                .finally(() => {
                  setWithdrawalButtonEnabled(true);
                });
            }}
          >
            Initiate withdrawal
          </button>
        </div>
      </WithdrawalModal>
    </div>
  );
}

export default App;
