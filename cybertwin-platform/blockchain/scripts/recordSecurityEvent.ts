import { network } from "hardhat";
import crypto from "node:crypto";
import "dotenv/config";


// ============================================================
// HARDHAT + VIEM
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
// CYBERTWIN ML RESULT
// ============================================================

const mlResult = {
  user_id: "USER_00001",

  risk_probability: 0.9846,

  risk_score: 98.46,

  risk_level: "CRITICAL",

  is_risky: true,

  anomaly_score: 0.7891,

  is_anomalous: true,

  top_reasons: [
    "12 external shares increased risk",
    "Login at hour 2 increased risk",
    "17 sensitive file accesses increased risk"
  ]
};


// ============================================================
// CANONICAL EVENT JSON
// ============================================================

const canonicalEvent =
  JSON.stringify(mlResult);


// ============================================================
// SHA-256 EVENT HASH
// ============================================================

const eventHashHex =
  crypto
    .createHash("sha256")
    .update(canonicalEvent)
    .digest("hex");

const eventHash =
  `0x${eventHashHex}` as `0x${string}`;


// ============================================================
// DISPLAY ML EVENT
// ============================================================

console.log("\n==========================================");
console.log("CYBERTWIN BLOCKCHAIN RECORD");
console.log("==========================================");

console.log("\nML Result:");
console.log(
  JSON.stringify(
    mlResult,
    null,
    2
  )
);

console.log("\nEvent Hash:");
console.log(eventHash);


// ============================================================
// GENERATE UNIQUE EVENT ID
// ============================================================

const eventId =
  `0x${crypto.randomBytes(32).toString("hex")}` as `0x${string}`;

console.log("\nEvent ID:");
console.log(eventId);


// ============================================================
// HASH USER ID
// ============================================================

const userIdHashHex =
  crypto
    .createHash("sha256")
    .update(mlResult.user_id)
    .digest("hex");

const userIdHash =
  `0x${userIdHashHex}` as `0x${string}`;


// ============================================================
// GET CYBERTWIN SMART CONTRACT
// ============================================================

const cyberTwinAudit =
  await viem.getContractAt(
    "CyberTwinAudit",
    CONTRACT_ADDRESS as `0x${string}`
  );


// ============================================================
// CONVERT RISK SCORE
// ============================================================
//
// Solidity stores risk scores as integers with 2 decimal places.
//
// ML:
//     98.46
//
// Blockchain:
//     9846
//
// Therefore:
//     blockchain value / 100 = ML value
//

const onChainRiskScore =
  BigInt(
    Math.round(
      mlResult.risk_score * 100
    )
  );


// ============================================================
// RECORD SECURITY EVENT
// ============================================================

console.log("\nRecording security event...");

const transactionHash =
  await cyberTwinAudit.write.recordSecurityEvent([
    eventId,
    userIdHash,
    eventHash,
    onChainRiskScore,
    mlResult.risk_level,
    mlResult.is_anomalous
  ]);

console.log("\nTransaction Hash:");
console.log(transactionHash);


// ============================================================
// WAIT FOR BLOCKCHAIN CONFIRMATION
// ============================================================

const publicClient =
  await viem.getPublicClient();

const receipt =
  await publicClient.waitForTransactionReceipt({
    hash: transactionHash
  });

console.log("\n✅ Blockchain transaction confirmed.");

console.log(
  "Block Number   :",
  receipt.blockNumber.toString()
);


// ============================================================
// READ EVENT FROM BLOCKCHAIN
// ============================================================

const storedEvent =
  await cyberTwinAudit.read.getSecurityEvent([
    eventId
  ]);


// ============================================================
// DISPLAY STORED RECORD
// ============================================================

console.log("\n==========================================");
console.log("STORED BLOCKCHAIN RECORD");
console.log("==========================================");

console.log(
  "Event ID       :",
  storedEvent[0]
);

console.log(
  "User ID Hash   :",
  storedEvent[1]
);

console.log(
  "Event Hash     :",
  storedEvent[2]
);

console.log(
  "Risk Score     :",
  storedEvent[3].toString()
);

console.log(
  "Risk Score     :",
  (
    Number(storedEvent[3]) / 100
  ).toFixed(2)
);

console.log(
  "Risk Level     :",
  storedEvent[4]
);

console.log(
  "Anomalous      :",
  storedEvent[5]
);

console.log(
  "Timestamp      :",
  storedEvent[6].toString()
);

console.log(
  "Recorded By    :",
  storedEvent[7]
);


// ============================================================
// VERIFY ORIGINAL HASH
// ============================================================

const verified =
  await cyberTwinAudit.read.verifyEvent([
    eventId,
    eventHash
  ]);


// ============================================================
// INTEGRITY RESULT
// ============================================================

console.log("\n==========================================");
console.log("INTEGRITY VERIFICATION");
console.log("==========================================");

console.log(
  "Hash Match     :",
  verified
    ? "✅ VERIFIED"
    : "❌ TAMPERED"
);

console.log("==========================================\n");


// ============================================================
// FINAL STATUS
// ============================================================

if (!verified) {

  throw new Error(
    "Blockchain integrity verification failed."
  );

}

console.log(
  "✅ CYBERTWIN SECURITY EVENT VERIFIED ON BLOCKCHAIN."
);