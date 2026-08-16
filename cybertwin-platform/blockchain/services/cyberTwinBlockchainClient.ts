import "dotenv/config";

import crypto from "node:crypto";

import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Address,
  type Hex
} from "viem";

import { privateKeyToAccount } from "viem/accounts";

import { cyberTwinAuditAbi } from "./cyberTwinAuditAbi.js";


// ============================================================
// ENVIRONMENT CONFIGURATION
// ============================================================

const CONTRACT_ADDRESS_ENV =
  process.env.CYBERTWIN_CONTRACT_ADDRESS;

const RPC_URL =
  process.env.BLOCKCHAIN_RPC_URL;

const PRIVATE_KEY =
  process.env.BLOCKCHAIN_PRIVATE_KEY;


// ============================================================
// CONFIGURATION VALIDATION
// ============================================================

if (!CONTRACT_ADDRESS_ENV) {
  throw new Error(
    "CYBERTWIN_CONTRACT_ADDRESS is not configured"
  );
}

if (!RPC_URL) {
  throw new Error(
    "BLOCKCHAIN_RPC_URL is not configured"
  );
}

if (!PRIVATE_KEY) {
  throw new Error(
    "BLOCKCHAIN_PRIVATE_KEY is not configured"
  );
}


// ============================================================
// GUARANTEED CONFIGURATION
// ============================================================

const CONTRACT_ADDRESS =
  CONTRACT_ADDRESS_ENV as Address;

const BLOCKCHAIN_PRIVATE_KEY =
  PRIVATE_KEY as Hex;


// ============================================================
// LOCAL HARDHAT CHAIN
// ============================================================

const blockchain = defineChain({
  id: 31337,

  name: "CyberTwin Local Blockchain",

  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },

  rpcUrls: {
    default: {
      http: [RPC_URL]
    }
  }
});


// ============================================================
// ACCOUNT
// ============================================================

const account =
  privateKeyToAccount(
    BLOCKCHAIN_PRIVATE_KEY
  );


// ============================================================
// PUBLIC CLIENT
// ============================================================

const publicClient =
  createPublicClient({
    chain: blockchain,
    transport: http(RPC_URL)
  });


// ============================================================
// WALLET CLIENT
// ============================================================

const walletClient =
  createWalletClient({
    account,
    chain: blockchain,
    transport: http(RPC_URL)
  });

// ============================================================
// TYPES
// ============================================================

export interface CyberTwinMLEvent {

  user_id: string;

  risk_probability: number;

  risk_score: number;

  risk_level: string;

  is_risky: boolean;

  anomaly_score: number;

  is_anomalous: boolean;

  top_reasons: string[];
}


export interface BlockchainRecord {

  eventId: Hex;

  transactionHash: Hex;

  eventHash: Hex;

  riskScore: number;

  verified: boolean;
}


// ============================================================
// HASH ML EVENT
// ============================================================

export function hashMLEvent(
  event: CyberTwinMLEvent
): Hex {

  const canonicalJSON =
    JSON.stringify(event);

  const hash =
    crypto
      .createHash("sha256")
      .update(canonicalJSON)
      .digest("hex");

  return `0x${hash}` as Hex;
}


// ============================================================
// HASH USER ID
// ============================================================

function hashUserId(
  userId: string
): Hex {

  const hash =
    crypto
      .createHash("sha256")
      .update(userId)
      .digest("hex");

  return `0x${hash}` as Hex;
}


// ============================================================
// GENERATE EVENT ID
// ============================================================

function generateEventId(): Hex {

  return (
    `0x${crypto.randomBytes(32).toString("hex")}`
  ) as Hex;
}


// ============================================================
// RECORD SECURITY EVENT
// ============================================================

export async function recordSecurityEvent(
  event: CyberTwinMLEvent
): Promise<BlockchainRecord> {

  // ----------------------------------------------------------
  // Generate identifiers
  // ----------------------------------------------------------

  const eventId =
    generateEventId();

  const eventHash =
    hashMLEvent(event);

  const userIdHash =
    hashUserId(event.user_id);


  // ----------------------------------------------------------
  // Validate risk score
  // ----------------------------------------------------------

  if (
    event.risk_score < 0 ||
    event.risk_score > 100
  ) {

    throw new Error(
      "Risk score must be between 0 and 100"
    );
  }


  // ----------------------------------------------------------
  // Convert ML score to blockchain format
  //
  // 98.46 → 9846
  // 70.87 → 7087
  // 3.58  → 358
  // ----------------------------------------------------------

  const onChainRiskScore =
    BigInt(
      Math.round(
        event.risk_score * 100
      )
    );


  // ----------------------------------------------------------
  // Write transaction
  // ----------------------------------------------------------

  const transactionHash =
    await walletClient.writeContract({

      address: CONTRACT_ADDRESS,

      abi: cyberTwinAuditAbi,

      functionName: "recordSecurityEvent",

      args: [
        eventId,
        userIdHash,
        eventHash,
        onChainRiskScore,
        event.risk_level,
        event.is_anomalous
      ]
    });


  // ----------------------------------------------------------
  // Wait for confirmation
  // ----------------------------------------------------------

  await publicClient.waitForTransactionReceipt({
    hash: transactionHash
  });


  // ----------------------------------------------------------
  // Verify stored event
  // ----------------------------------------------------------

  const verified =
    await publicClient.readContract({

      address: CONTRACT_ADDRESS,

      abi: cyberTwinAuditAbi,

      functionName: "verifyEvent",

      args: [
        eventId,
        eventHash
      ]
    });


  return {

    eventId,

    transactionHash,

    eventHash,

    riskScore:
      Number(onChainRiskScore) / 100,

    verified
  };
}


// ============================================================
// VERIFY SECURITY EVENT
// ============================================================

export async function verifySecurityEvent(
  eventId: Hex,
  event: CyberTwinMLEvent
): Promise<boolean> {

  const calculatedHash =
    hashMLEvent(event);


  return await publicClient.readContract({

    address: CONTRACT_ADDRESS,

    abi: cyberTwinAuditAbi,

    functionName: "verifyEvent",

    args: [
      eventId,
      calculatedHash
    ]
  });
}


// ============================================================
// READ SECURITY EVENT
// ============================================================

export async function getSecurityEvent(
  eventId: Hex
) {

  return await publicClient.readContract({

    address: CONTRACT_ADDRESS,

    abi: cyberTwinAuditAbi,

    functionName: "getSecurityEvent",

    args: [
      eventId
    ]
  });
}


// ============================================================
// CHECK AUTHORIZED RECORDER
// ============================================================

export async function isAuthorizedRecorder(
  address: Address = account.address
): Promise<boolean> {

  return await publicClient.readContract({

    address: CONTRACT_ADDRESS,

    abi: cyberTwinAuditAbi,

    functionName: "authorizedRecorders",

    args: [
      address
    ]
  });
}