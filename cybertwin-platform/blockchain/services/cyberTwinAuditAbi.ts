export const cyberTwinAuditAbi = [
  {
    type: "function",
    name: "recordSecurityEvent",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "eventId",
        type: "bytes32"
      },
      {
        name: "userIdHash",
        type: "bytes32"
      },
      {
        name: "eventHash",
        type: "bytes32"
      },
      {
        name: "riskScore",
        type: "uint256"
      },
      {
        name: "riskLevel",
        type: "string"
      },
      {
        name: "isAnomalous",
        type: "bool"
      }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "verifyEvent",
    stateMutability: "view",
    inputs: [
      {
        name: "eventId",
        type: "bytes32"
      },
      {
        name: "providedHash",
        type: "bytes32"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ]
  },

  {
    type: "function",
    name: "getSecurityEvent",
    stateMutability: "view",
    inputs: [
      {
        name: "eventId",
        type: "bytes32"
      }
    ],
    outputs: [
      {
        name: "eventId",
        type: "bytes32"
      },
      {
        name: "userIdHash",
        type: "bytes32"
      },
      {
        name: "eventHash",
        type: "bytes32"
      },
      {
        name: "riskScore",
        type: "uint256"
      },
      {
        name: "riskLevel",
        type: "string"
      },
      {
        name: "isAnomalous",
        type: "bool"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "recordedBy",
        type: "address"
      }
    ]
  },

  {
    type: "function",
    name: "eventExists",
    stateMutability: "view",
    inputs: [
      {
        name: "eventId",
        type: "bytes32"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ]
  },

  {
    type: "function",
    name: "authorizedRecorders",
    stateMutability: "view",
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ]
  }
] as const;