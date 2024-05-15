import { UseBalanceReturnType } from "wagmi";
import { formatBalance } from "../utils";

export const Balance = ({
  amount,
}: {
  amount: UseBalanceReturnType["data"];
}) => {
  if (!amount) {
    return null;
  }
  return (
    <p className="text-sm font-normal">
      Balance: {formatBalance(amount.value, amount.decimals)} {amount.symbol}
    </p>
  );
};
