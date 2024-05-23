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

export const l1StandardBridgeAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "localToken", "type": "address" }, { "indexed": true, "internalType": "address", "name": "remoteToken", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ERC20BridgeFinalized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "localToken", "type": "address" }, { "indexed": true, "internalType": "address", "name": "remoteToken", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ERC20BridgeInitiated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "l1Token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "l2Token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ERC20DepositInitiated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "l1Token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "l2Token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ERC20WithdrawalFinalized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ETHBridgeFinalized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ETHBridgeInitiated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ETHDepositInitiated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "extraData", "type": "bytes" }], "name": "ETHWithdrawalFinalized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8" }], "name": "Initialized", "type": "event" }, { "inputs": [], "name": "MESSENGER", "outputs": [{ "internalType": "contract CrossDomainMessenger", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "OTHER_BRIDGE", "outputs": [{ "internalType": "contract StandardBridge", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_localToken", "type": "address" }, { "internalType": "address", "name": "_remoteToken", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "bridgeERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_localToken", "type": "address" }, { "internalType": "address", "name": "_remoteToken", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "bridgeERC20To", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "bridgeETH", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "bridgeETHTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1Token", "type": "address" }, { "internalType": "address", "name": "_l2Token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1Token", "type": "address" }, { "internalType": "address", "name": "_l2Token", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositERC20To", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositETH", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositETHTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_localToken", "type": "address" }, { "internalType": "address", "name": "_remoteToken", "type": "address" }, { "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "finalizeBridgeERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "finalizeBridgeETH", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_l1Token", "type": "address" }, { "internalType": "address", "name": "_l2Token", "type": "address" }, { "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "finalizeERC20Withdrawal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "finalizeETHWithdrawal", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "contract CrossDomainMessenger", "name": "_messenger", "type": "address" }, { "internalType": "contract SuperchainConfig", "name": "_superchainConfig", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "l2TokenBridge", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "messenger", "outputs": [{ "internalType": "contract CrossDomainMessenger", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "otherBridge", "outputs": [{ "internalType": "contract StandardBridge", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "superchainConfig", "outputs": [{ "internalType": "contract SuperchainConfig", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }] as const;

export const l2ToL1MessagePasserAbi = [
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "MESSAGE_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "burn",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initiateWithdrawal",
    inputs: [
      {
        name: "_target",
        type: "address",
        internalType: "address",
      },
      {
        name: "_gasLimit",
        type: "uint256",
        internalType: "uint256",
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
    name: "messageNonce",
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
    name: "sentMessages",
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
    name: "MessagePassed",
    inputs: [
      {
        name: "nonce",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "target",
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
      {
        name: "gasLimit",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "withdrawalHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawerBalanceBurnt",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;

export const valueEventAbi = [
  {
    type: "event",
    name: "Event",
    inputs: [
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
