import { clsx } from "clsx";
import { uiConfig as ui } from "../config";
import type { BridgeMode } from "../types";

export const Tabs = ({
  bridgeMode,
  setBridgeMode,
}: {
  bridgeMode: BridgeMode;
  setBridgeMode: (mode: BridgeMode) => void;
}) => {
  const handleTabClick =
    (mode: BridgeMode) => async (event: React.MouseEvent) => {
      event.preventDefault();
      setBridgeMode(mode);
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

  return (
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
  );
};
