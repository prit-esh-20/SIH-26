import { network } from "hardhat";
import crypto from "node:crypto";
import "dotenv/config";


// ============================================================
// VIEM
// ============================================================

const { viem } = await network.create();


// ============================================================
// CONTRACT CONFIGURATION
// ============================================================

const CONTRACT_ADDRESS =
  process.env.CYBERTWIN_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error(
    "CYBERTWIN_CONTRACT_ADDRESS is not configured"
  );
}


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
  eventId: `0x${string}`;
  transactionHash: `0x${string}`;
  eventHash: `0x${string}`;
  riskScore: number;
  verified: boolean;
}


// ============================================================
// CONTRACT
// ============================================================

const cyberTwinAudit =
  await viem.getContractAt(
    "CyberTwinAudit",
    CONTRACT_ADDRESS as `0x${string}`
  );


// ============================================================
// HASH EVENT
// ============================================================

export function hashMLEvent(
  event: CyberTwinMLEvent
): `0x${string}` {

  const canonicalJSON =
    JSON.stringify(event);

  const hash =
    crypto
      .createHash("sha256")
      .update(canonicalJSON)
      .digest("hex");

  return `0x${hash}` as `0x${string}`;
}


// ============================================================
// HASH USER ID
// ============================================================

function hashUserId(
  userId: string
): `0x${string}` {

  const hash =
    crypto
      .createHash("sha256")
      .update(userId)
      .digest("hex");

  return `0x${hash}` as `0x${string}`;
}


// ============================================================
// GENERATE EVENT ID
// ============================================================

function generateEventId(): `0x${string}` {

  return (
    `0x${crypto.randomBytes(32).toString("hex")}`
  ) as `0x${string}`;
}


// ============================================================
// RECORD SECURITY EVENT
// ============================================================

export async function recordSecurityEvent(
  event: CyberTwinMLEvent
): Promise<BlockchainRecord> {

  const eventId =
    generateEventId();

  const eventHash =
    hashMLEvent(event);

  const userIdHash =
    hashUserId(event.user_id);


  // ----------------------------------------------------------
  // Convert ML score to on-chain integer
  // ----------------------------------------------------------

  const riskScore =
    BigInt(
      Math.round(
        event.risk_score * 100
      )
    );


  if (
    riskScore < 0n ||
    riskScore > 10000n
  ) {

    throw new Error(
      "Risk score must be between 0 and 100"
    );
  }


  // ----------------------------------------------------------
  // Write blockchain transaction
  // ----------------------------------------------------------

  const transactionHash =
    await cyberTwinAudit.write.recordSecurityEvent([
      eventId,
      userIdHash,
      eventHash,
      riskScore,
      event.risk_level,
      event.is_anomalous
    ]);


  // ----------------------------------------------------------
  // Wait for confirmation
  // ----------------------------------------------------------

  const publicClient =
    await viem.getPublicClient();

  await publicClient.waitForTransactionReceipt({
    hash: transactionHash
  });


  // ----------------------------------------------------------
  // Verify immediately
  // ----------------------------------------------------------

  const verified =
    await cyberTwinAudit.read.verifyEvent([
      eventId,
      eventHash
    ]);


  return {
    eventId,
    transactionHash,
    eventHash,
    riskScore:
      Number(riskScore) / 100,
    verified
  };
}


// ============================================================
// VERIFY EVENT
// ============================================================

export async function verifySecurityEvent(
  eventId: `0x${string}`,
  event: CyberTwinMLEvent
): Promise<boolean> {

  const calculatedHash =
    hashMLEvent(event);

  return await cyberTwinAudit.read.verifyEvent([
    eventId,
    calculatedHash
  ]);
}