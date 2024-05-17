export const erc20Abi = [
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;

export const optimismPortalAbi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "balance",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "depositERC20Transaction",
    inputs: [
      {
        name: "_to",
        type: "address",
        internalType: "address",
      },
      {
        name: "_mint",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_gasLimit",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "_isCreation",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "_data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositTransaction",
    inputs: [
      {
        name: "_to",
        type: "address",
        internalType: "address",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_gasLimit",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "_isCreation",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "_data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "donateETH",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "finalizeWithdrawalTransaction",
    inputs: [
      {
        name: "_tx",
        type: "tuple",
        internalType: "struct Types.WithdrawalTransaction",
        components: [
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sender",
            type: "address",
            internalType: "address",
          },
          {
            name: "target",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "gasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finalizedWithdrawals",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gasPayingToken",
    inputs: [],
    outputs: [
      {
        name: "addr_",
        type: "address",
        internalType: "address",
      },
      {
        name: "decimals_",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "guardian",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_l2Oracle",
        type: "address",
        internalType: "contract L2OutputOracle",
      },
      {
        name: "_systemConfig",
        type: "address",
        internalType: "contract SystemConfig",
      },
      {
        name: "_superchainConfig",
        type: "address",
        internalType: "contract SuperchainConfig",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isOutputFinalized",
    inputs: [
      {
        name: "_l2OutputIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "l2Oracle",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract L2OutputOracle",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "l2Sender",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minimumGasLimit",
    inputs: [
      {
        name: "_byteCount",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "params",
    inputs: [],
    outputs: [
      {
        name: "prevBaseFee",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "prevBoughtGas",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "prevBlockNum",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [
      {
        name: "paused_",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proveWithdrawalTransaction",
    inputs: [
      {
        name: "_tx",
        type: "tuple",
        internalType: "struct Types.WithdrawalTransaction",
        components: [
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sender",
            type: "address",
            internalType: "address",
          },
          {
            name: "target",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "gasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "_l2OutputIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_outputRootProof",
        type: "tuple",
        internalType: "struct Types.OutputRootProof",
        components: [
          {
            name: "version",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "stateRoot",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "messagePasserStorageRoot",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "latestBlockhash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "_withdrawalProof",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "provenWithdrawals",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "outputRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "timestamp",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "l2OutputIndex",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setGasPayingToken",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "address",
      },
      {
        name: "_decimals",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "_name",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_symbol",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "superchainConfig",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract SuperchainConfig",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "systemConfig",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract SystemConfig",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransactionDeposited",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "version",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "opaqueData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawalFinalized",
    inputs: [
      {
        name: "withdrawalHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "success",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawalProven",
    inputs: [
      {
        name: "withdrawalHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "BadTarget",
    inputs: [],
  },
  {
    type: "error",
    name: "CallPaused",
    inputs: [],
  },
  {
    type: "error",
    name: "GasEstimation",
    inputs: [],
  },
  {
    type: "error",
    name: "LargeCalldata",
    inputs: [],
  },
  {
    type: "error",
    name: "NoValue",
    inputs: [],
  },
  {
    type: "error",
    name: "NonReentrant",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyCustomGasToken",
    inputs: [],
  },
  {
    type: "error",
    name: "OutOfGas",
    inputs: [],
  },
  {
    type: "error",
    name: "SmallGasLimit",
    inputs: [],
  },
  {
    type: "error",
    name: "TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "Unauthorized",
    inputs: [],
  },
] as const;




export const l1tol2mesAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nonce","type":"uint256"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"gasLimit","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes32","name":"withdrawalHash","type":"bytes32"}],"name":"MessagePassed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawerBalanceBurnt","type":"event"},{"inputs":[],"name":"MESSAGE_VERSION","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"uint256","name":"_gasLimit","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"initiateWithdrawal","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"messageNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"sentMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}] as const;
