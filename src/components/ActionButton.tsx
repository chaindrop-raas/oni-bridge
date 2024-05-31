import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { parentChain, rollupChain } from "../config";
import { useIsParentChain } from "../hooks";
import { BridgeMode } from "../types";
import { WalletIcon } from "./icons";

type ButtonMode =
  | "approve"
  | "deposit"
  | "withdraw"
  | "network-error"
  | "connect-wallet";

export const ActionButton = ({
  disabled,
  mode,
  depositApproved,
}: {
  disabled: boolean;
  mode: BridgeMode;
  depositApproved: boolean;
}) => {
  const { isParentChain, isChildChain } = useIsParentChain();
  const [buttonMode, setButtonMode] = useState<ButtonMode>("withdraw");
  const { data: walletClient } = useWalletClient();
  const { openConnectModal } = useConnectModal();

  const chainForMode = mode === "deposit" ? parentChain : rollupChain;

  const labels = {
    approve: "Approve",
    deposit: "Deposit",
    withdraw: "Withdraw",
    "network-error": `Switch to ${chainForMode.name}`,
  };

  useEffect(() => {
    if (!walletClient?.account) {
      setButtonMode("connect-wallet");
    } else if (
      (isParentChain && mode === "withdraw") ||
      (isChildChain && mode === "deposit")
    ) {
      setButtonMode("network-error");
    } else if (mode === "deposit") {
      if (depositApproved) {
        setButtonMode("deposit");
      } else {
        setButtonMode("approve");
      }
    } else {
      setButtonMode("withdraw");
    }
  }, [
    isChildChain,
    isParentChain,
    mode,
    depositApproved,
    walletClient?.account,
  ]);

  if (buttonMode === "network-error") {
    return (
      <button
        onClick={() => {
          walletClient?.switchChain({ id: chainForMode.id });
        }}
        className={clsx(
          "w-full rounded-[4px] py-3 px-4 text-sm disabled:bg-gray-300",
          buttonMode === "network-error" && "bg-red-400 text-white"
        )}
      >
        {labels[buttonMode]}
      </button>
    );
  }

  if (buttonMode === "connect-wallet") {
    return (
      <button
        onClick={openConnectModal}
        className={clsx(
          "w-full rounded-[4px] py-3 px-4 text-sm",
          "bg-accent dark:bg-accent-dark",
          "text-accent-fg dark:text-accent-fg-dark",
          "flex flex-row items-center justify-center gap-1"
        )}
      >
        <WalletIcon />
        Connect wallet
      </button>
    );
  }

  return (
    <button
      type="submit"
      className={clsx(
        "w-full rounded-[4px] py-3 px-4 text-sm disabled:bg-gray-300",
        "disabled:text-slate-400 disabled:cursor-not-allowed",
        "bg-accent dark:bg-accent-dark",
        "text-accent-fg dark:text-accent-fg-dark"
      )}
      disabled={disabled}
    >
      {labels[buttonMode]}
    </button>
  );
};
