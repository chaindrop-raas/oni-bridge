import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { parentChain, rollupChain, token, newToken1, newToken2 } from "./config";
import { approvalTransaction, depositTransaction } from "./txs/deposit";
import { Balance } from "./components/Balance";
import { useCurrentChainBalance, useGetAllowance, useTransactionStorage } from "./hooks";
import { BridgeMode, WalletClient } from "./types";
import { formatBalance } from "./utils";
import { walletActionsL1, walletActionsL2 } from "viem/op-stack";
import { BridgeDirection } from "./components/BridgeDirection";
import { OperationSummary } from "./components/OperationSummary";
import { ActionButton } from "./components/ActionButton";
import { Transactions } from "./components/Transactions";
import { Tabs } from "./components/Tabs";

type Inputs = {
  amount: bigint;
  token: string;
};

const tokenMap = {
  [token.address]: {
    symbol: token.symbol,
    l2Token: "0xL2TokenAddress1" // Replace with actual L2 token address
  },
  [newToken1.address]: {
    symbol: newToken1.symbol,
    l2Token: "0xL2TokenAddress2" // Replace with actual L2 token address
  },
  [newToken2.address]: {
    symbol: newToken2.symbol,
    l2Token: "0xL2TokenAddress3" // Replace with actual L2 token address
  }
};

function App() {
  const balance = useCurrentChainBalance();
  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [isApproved, setApproved] = useState(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const [bridgeMode, setBridgeMode] = useState<BridgeMode>("deposit");
  const { transactions, addTransaction } = useTransactionStorage();

  const logoUrl = import.meta.env.VITE_BRIDGE_LOGO_URL;

  const { formState: { errors }, handleSubmit, register, watch } = useForm<Inputs>({ defaultValues: { amount: 0n, token: token.address } });
  const amount = parseEther(watch("amount").toString());
  const selectedTokenAddress = watch("token");
  const allowance = useGetAllowance(walletClient, amount, selectedTokenAddress);

  const approvalFn = async (walletClient: WalletClient, amount: bigint) => {
    const l1WalletClient = walletClient.extend(walletActionsL1());
    const transaction = await approvalTransaction(l1WalletClient, amount, selectedTokenAddress);
    addTransaction(transaction);
  };

  const depositFn = async (walletClient: WalletClient, amount: bigint) => {
    const l1WalletClient = walletClient.extend(walletActionsL1());
    const l2Token = tokenMap[selectedTokenAddress].l2Token;
    const transaction = await depositTransaction(l1WalletClient, amount, selectedTokenAddress, l2Token);
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
          await depositFn(walletClient, submittedAmount);
        } else {
          await approvalFn(walletClient, submittedAmount);
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

  const targetChain = bridgeMode === "deposit" ? rollupChain : parentChain;

  useEffect(() => {
    setApproved(allowance >= amount);
    amount === 0n ? setActionButtonDisabled(true) : setActionButtonDisabled(false);
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
          <div className="flex flex-col gap-1 rounded-xl bg-[#fafafa] px-8 pt-6 pb-8">
            <BridgeDirection bridgeMode={bridgeMode} />
            <div className="flex flex-row gap-4 items-start justify-between">
              <div className="flex flex-1 flex-col gap-4">
                <select
                  className="block w-full rounded-lg border-[#D2D1D4] border-2 text-xl placeholder:text-[#D2D1D4]"
                  {...register("token", { required: true })}
                >
                  <option value={token.address}>{token.symbol}</option>
                  <option value={newToken1.address}>{newToken1.symbol}</option>
                  <option value={newToken2.address}>{newToken2.symbol}</option>
                </select>
                <input
                  type="number"
                  step="any"
                  id="amount"
                  className="block w-full rounded-lg border-[#D2D1D4] border-2 text-xl placeholder:text-[#D2D1D4]"
                  placeholder="0.00"
                  {...register("amount", { required: true })}
                  aria-invalid={errors.amount ? "true" : "false"}
                />
              </div>
              <div className="pr-2 pt-1 text-gray-500">
                {walletClient && (
                  <>
                    <div className="h-5 w-5">
                      <svg
                        className="h-5 w-5 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
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
              <p>
                {selectedTokenAddress === token.address
                  ? token.symbol
                  : selectedTokenAddress === newToken1.address
                  ? newToken1.symbol
                  : newToken2.symbol}
              </p>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600" id="amount-error">
                Amount must be between 0 and{" "}
                {formatBalance(balance?.value ?? 0n, balance?.decimals ?? 18)}{" "}
                {selectedTokenAddress === token.address
                  ? token.symbol
                  : selectedTokenAddress === newToken1.address
                  ? newToken1.symbol
                  : newToken2.symbol}
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
    </div>
  );
}

export default App;
