import { format } from "dnum";

export const formatBalance = (balance: bigint, decimals: number) => {
  return format([balance, decimals], {
    digits: 2,
  });
};
