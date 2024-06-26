import * as Dialog from "@radix-ui/react-dialog";
import { formatEther, type WaitForTransactionReceiptReturnType } from "viem";

import { rollupChain } from "../config";
import { CloseIcon, ExternalLinkIcon, WithdrawalStatusIcon } from "./icons";
import { blockExplorerURL } from "../utils";
import { StatusReturnType } from "../types";
import clsx from "clsx";

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
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
      <Dialog.Content className="fixed inset-0 flex justify-center items-center">
        <div
          className={clsx(
            "p-8 lg:rounded-lg flex flex-col gap-8 bg-base text-foreground fixed lg:relative",
            "top-0 bottom-0 left-0 right-0",
            "mx-auto min-w-96 justify-between"
          )}
        >
          <div className="flex flex-col gap-6">
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
                <p className="text-subdued text-base font-normal">
                  Amount of withdrawal
                </p>
                <p className="font-medium text-xl">
                  {formatEther(amount)} {rollupChain.nativeCurrency.symbol}
                </p>
              </div>
            </div>
            <ul className="list-image-[url(/images/vertical-dashes.svg)] list-inside">
              <li className="flex flex-row justify-between">
                <div className="flex flex-row gap-1">
                  <WithdrawalStatusIcon status={status} step={0} />
                  <p>Initiate Withdrawal</p>
                </div>
                {transaction && (
                  <a
                    href={blockExplorerURL(transaction)}
                    target="_blank"
                    className="text-accent text-xs flex flex-row gap-1 items-center"
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
          </div>
          <div className="flex flex-col gap-4">
            {children}
            <p className="text-subdued font-normal text-sm text-center hidden lg:block">
              You can close this window and reopen it later by clicking on the
              transaction.
            </p>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
