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
import { formatBalance } from "./utils";
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
        if (isApproved) {
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
    setApproved(amount > 0n && allowance >= amount);
    amount === 0n
      ? setActionButtonDisabled(true)
      : setActionButtonDisabled(false);
  }, [amount, allowance]);

  return (
    <div className="flex flex-col gap-6 my-6">
      <div className="flex flex-row justify-between px-6">
        <div className="">
          <img src={logoUrl} alt="logo" width={40} height={40} />
        </div>
        <div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
      <div className="mx-auto lg:w-[488px] flex flex-col gap-4">
        <Tabs bridgeMode={bridgeMode} setBridgeMode={setBridgeMode} />
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
                          clipRule="evenodd"
                          fillRule="evenodd"
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
              depositApproved={isApproved}
              targetChain={targetChain}
            />
            <ActionButton
              mode={bridgeMode}
              depositApproved={isApproved}
              disabled={!account.isConnected || actionButtonDisabled}
            />
          </div>
        </form>
      </div>
      <div className="w-full lg:w-[488px] m-auto flex flex-col gap-4">
        <Transactions transactions={transactions} />
      </div>
      <DepositModal
        amount={amount}
        open={showDepositModal}
        setOpen={setShowDepositModal}
        triggerDeposit={() => {
          depositFn(walletClient as WalletClient, amount);
        }}
      />
      <WithdrawalModal
        amount={amount}
        open={showWithdrawalModal}
        setOpen={handleWithdrawalModalToggle}
        status="initializing"
      >
        <div className="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            checked={acknowledgementOne}
            onChange={() => setAcknowledgementOne(!acknowledgementOne)}
          />
          <p className="text-sm text-[#9e9ba6]">
            I understand it will take ~7 days until my funds are claimable on{" "}
            {parentChain.name}.
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            checked={acknowledgementTwo}
            onChange={() => setAcknowledgementTwo(!acknowledgementTwo)}
          />
          <p className="text-sm text-[#9e9ba6]">
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
            className="border-accent text-accent dark:border-accent-dark dark:text-accent-dark bg-accent text-accent-foreground text-xs rounded-[4px] border w-full py-3 disabled:bg-[#fafafa] disabled:text-[#D2D1D4] disabled:border-none"
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
