import { defineChain } from "viem";
import { useWalletClient } from "wagmi";
import { parentChain, rollupChain, config } from "../config";

const ChainIcon = ({ chain }: { chain: ReturnType<typeof defineChain> }) => {
  return <img src={chain.iconUrl} alt={chain.name} width={40} height={40} />;
};

const ChainInfo = ({
  chain,
  label,
}: {
  chain: ReturnType<typeof defineChain>;
  label: string;
}) => {
  return (
    <div className="w-2/5 flex flex-row items-center gap-3">
      <ChainIcon chain={chain} />
      <div className="">
        <p className="text-subdued">{label}</p>
        <p className="text-xl">{chain.name}</p>
      </div>
    </div>
  );
};

const isValidChain = (chain: ReturnType<typeof defineChain>) => {
  return config.chains.map((c) => c.id).includes(chain.id);
};

export const BridgeDirection = () => {
  const { data: walletClient } = useWalletClient();

  if (!walletClient || !isValidChain(walletClient.chain)) {
    return null;
  }

  const sourceChain =
    walletClient.chain.id === parentChain.id ? parentChain : rollupChain;
  const destinationChain =
    walletClient.chain.id === parentChain.id ? rollupChain : parentChain;

  return (
    <div className="flex flex-row justify-between">
      <ChainInfo chain={sourceChain} label="From" />
      <div className="flex flex-row items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 7L20 12L15 17"
            stroke="#919AA9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12L19 12"
            stroke="#919AA9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <ChainInfo chain={destinationChain} label="To" />
    </div>
  );
};
