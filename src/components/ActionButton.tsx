import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";

import { parentChain, rollupChain } from "../config";
import { useIsParentChain } from "../hooks";
import { BridgeMode } from "../types";

type ButtonMode = "approve" | "deposit" | "withdraw" | "network-error";

export const ActionButton = ({
  disabled,
  mode,
  withdrawalApproved,
}: {
  disabled: boolean;
  mode: BridgeMode;
  withdrawalApproved: boolean;
}) => {
  const isParentChain = useIsParentChain();
  const [buttonMode, setButtonMode] = useState<ButtonMode>("withdraw");
  const { data: walletClient } = useWalletClient();

  const chainForMode = mode === "deposit" ? parentChain : rollupChain;

  const labels = {
    approve: "Approve",
    deposit: "Deposit",
    withdraw: "Withdraw",
    "network-error": `Switch to ${chainForMode.name}`,
  };

  useEffect(() => {
    if (
      (isParentChain && mode === "withdraw") ||
      (!isParentChain && mode === "deposit")
    ) {
      setButtonMode("network-error");
    } else if (mode === "deposit") {
      if (withdrawalApproved) {
        setButtonMode("deposit");
      } else {
        setButtonMode("approve");
      }
    } else {
      setButtonMode("withdraw");
    }
  }, [isParentChain, mode, withdrawalApproved]);

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

  return (
    <button
      type="submit"
      className={clsx(
        "w-full rounded-[4px] py-3 px-4 text-sm disabled:bg-gray-300",
        "disabled:text-slate-400 disabled:cursor-not-allowed",
        "bg-accent dark:bg-accent-dark",
        "text-accent-foreground dark:text-accent-foreground-dark"
      )}
      disabled={disabled}
    >
      {labels[buttonMode]}
    </button>
  );
};
