import * as Dialog from "@radix-ui/react-dialog";
import { CloseIcon } from "./icons";
import { formatEther } from "viem";
import { parentChain, rollupChain } from "../config";
import clsx from "clsx";
import { useEstimateDepositGas } from "../hooks";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[#9e9ba6] text-base font-normal">{label}</p>
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
  triggerDeposit: () => void;
}) => {
  const { gas: gasEstimate } = useEstimateDepositGas({ amount });
  const buttonStyle = clsx(
    "border-accent text-accent dark:border-accent-dark dark:text-accent-dark",
    "text-xs rounded-[4px] border w-full py-3"
  );

  const activeButtonStyle = clsx(
    "border-accent bg-accent text-accent-foreground",
    buttonStyle
  );
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <Dialog.Title className="font-semibold text-2xl">
            Deposit
          </Dialog.Title>
          <Dialog.Close>
            <CloseIcon />
          </Dialog.Close>
        </div>
        <div className="w-96 flex flex-col gap-6">
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
          <div className="flex flex-row gap-2">
            <Dialog.Close asChild>
              <button className={buttonStyle}>Cancel</button>
            </Dialog.Close>
            <button className={activeButtonStyle} onClick={triggerDeposit}>
              Deposit
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
