import { format } from "dnum";

export const formatBalance = (balance: bigint, decimals: number) => {
  return format([balance, decimals], {
    digits: 2,
    trailingZeros: true,
  });
};

export const titleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
};
