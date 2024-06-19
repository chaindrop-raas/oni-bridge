import * as Dialog from "@radix-ui/react-dialog";
import { CloseIcon } from "./icons";
import { formatEther } from "viem";
import { parentChain, rollupChain } from "../config";
import clsx from "clsx";
import { useEstimateDepositGas } from "../hooks";
import { useState } from "react";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-subdued text-base font-normal">{label}</p>
    <p className="font-medium text-xl">{value}</p>
  </div>
);

export const DepositModal = ({
  amount,
  open,
  setOpen,
  triggerDeposit,
}: {
  amount: bigint;
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerDeposit: () => Promise<void>;
}) => {
  const { gas: gasEstimate } = useEstimateDepositGas({ amount });
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const buttonStyle = clsx(
    "text-xs rounded-[4px] border w-full py-3 border-accent text-accent",
    "disabled:bg-faded disabled:text-subdued disabled:border-none disabled:cursor-not-allowed"
  );

  const activeButtonStyle = clsx(
    "border-accent bg-accent text-accent-fg",
    buttonStyle
  );
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
      <Dialog.Content className="fixed inset-0 flex justify-center items-center">
        <div
          className={clsx(
            "p-8 lg:rounded-lg flex flex-col gap-8 bg-base text-foreground fixed lg:relative",
            "top-0 bottom-0 left-0 right-0",
            "mx-auto min-w-96 justify-between"
          )}
        >
          <div className="">
            <div className="flex flex-row justify-between items-start">
              <Dialog.Title className="font-semibold text-2xl">
                Deposit
              </Dialog.Title>
              <Dialog.Close>
                <CloseIcon />
              </Dialog.Close>
            </div>
            <div className="flex flex-col gap-6">
              <DetailRow label="Routing" value="Standard Speed" />
              <DetailRow
                label="Amount of deposit"
                value={`${formatEther(amount)} ${
                  rollupChain.nativeCurrency.symbol
                }`}
              />
              <DetailRow
                label="Gas fee"
                value={`${formatEther(gasEstimate)} ${
                  parentChain.nativeCurrency.symbol
                }`}
              />
              <DetailRow label="Time to transfer" value="~1 minute" />
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <Dialog.Close asChild>
              <button className={buttonStyle}>Cancel</button>
            </Dialog.Close>
            <button
              className={activeButtonStyle}
              disabled={!buttonEnabled}
              onClick={() => {
                setButtonEnabled(false);
                triggerDeposit()
                  .then(() => {
                    setOpen(false);
                  })
                  .finally(() => {
                    setButtonEnabled(true);
                  });
              }}
            >
              Deposit
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
