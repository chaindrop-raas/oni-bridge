import * as Dialog from "@radix-ui/react-dialog";
import { formatEther, type WaitForTransactionReceiptReturnType } from "viem";

import { rollupChain } from "../config";
import { CloseIcon, ExternalLinkIcon, WithdrawalStatusIcon } from "./icons";
import { blockExplorerURL } from "../utils";
import { StatusReturnType } from "../types";

export const WithdrawalModal = ({
  amount,
  children,
  open,
  setOpen,
  status,
  trigger,
  transaction,
}: {
  amount: bigint;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  status: StatusReturnType;
  trigger?: React.ReactNode;
  transaction?: WaitForTransactionReceiptReturnType;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <Dialog.Title className="font-semibold text-2xl">
            Withdrawal
          </Dialog.Title>
          <Dialog.Close>
            <CloseIcon />
          </Dialog.Close>
        </div>
        <div>
          <div>
            <p className="text-[#9e9ba6] text-base font-normal">
              Amount of withdrawal
            </p>
            <p className="font-medium text-xl">
              {formatEther(amount)} {rollupChain.nativeCurrency.symbol}
            </p>
          </div>
        </div>
        <Dialog.Description asChild>
          <div className="max-w-2xl min-w-xl flex flex-col gap-6">
            <ul className="list-image-[url(/vertical-dashes.svg)] list-inside">
              <li className="flex flex-row justify-between">
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={0} />
                  <p>Initiate Withdrawal</p>
                </div>
                {transaction && (
                  <a
                    href={blockExplorerURL(transaction)}
                    target="_blank"
                    className="text-accent dark:text-accent-dark text-xs flex flex-row gap-1 items-center"
                  >
                    See transaction
                    <ExternalLinkIcon />
                  </a>
                )}
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={1} />
                  <p>Wait up to 1 hour</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={2} />
                  <p>Prove Withdrawal</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={3} />
                  <p>Wait 7 days</p>
                </div>
              </li>
              <li>
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={4} />
                  <p>Claim withdrawal</p>
                </div>
              </li>
            </ul>
            {children}
            <p className="text-[#9e9ba6] font-normal text-sm text-center">
              You can close this window and reopen it later by clicking on the
              transaction.
            </p>
          </div>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
};
