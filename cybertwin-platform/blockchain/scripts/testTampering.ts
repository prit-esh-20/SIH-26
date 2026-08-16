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
// ORIGINAL EVENT
// ============================================================

const originalEvent = {
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
// TAMPERED EVENT
// ============================================================

const tamperedEvent = {
  ...originalEvent,

  // Simulate an attacker modifying the recorded risk score
  risk_score: 20.00
};


// ============================================================
// HASH FUNCTION
// ============================================================

function calculateHash(
  event: object
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
// CALCULATE HASHES
// ============================================================

const originalHash =
  calculateHash(originalEvent);

const tamperedHash =
  calculateHash(tamperedEvent);


// ============================================================
// GENERATE EVENT ID
// ============================================================

const eventId =
  `0x${crypto.randomBytes(32).toString("hex")}` as `0x${string}`;


// ============================================================
// HASH USER ID
// ============================================================

const userIdHash =
  `0x${
    crypto
      .createHash("sha256")
      .update(originalEvent.user_id)
      .digest("hex")
  }` as `0x${string}`;


// ============================================================
// GET CONTRACT
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
// 98.46 → 9846
//
// The smart contract stores risk scores with
// two decimal places.
//

const onChainRiskScore =
  BigInt(
    Math.round(
      originalEvent.risk_score * 100
    )
  );


// ============================================================
// HEADER
// ============================================================

console.log("\n==========================================");
console.log("CYBERTWIN TAMPER DETECTION TEST");
console.log("==========================================");


// ============================================================
// DISPLAY ORIGINAL EVENT
// ============================================================

console.log("\nOriginal Risk Score:");
console.log(
  originalEvent.risk_score
);

console.log("\nOriginal Hash:");
console.log(
  originalHash
);


// ============================================================
// DISPLAY TAMPERED EVENT
// ============================================================

console.log("\nTampered Risk Score:");
console.log(
  tamperedEvent.risk_score
);

console.log("\nTampered Hash:");
console.log(
  tamperedHash
);


// ============================================================
// RECORD ORIGINAL EVENT
// ============================================================

console.log("\nRecording original event...");

const transactionHash =
  await cyberTwinAudit.write.recordSecurityEvent([
    eventId,
    userIdHash,
    originalHash,
    onChainRiskScore,
    originalEvent.risk_level,
    originalEvent.is_anomalous
  ]);


// ============================================================
// WAIT FOR CONFIRMATION
// ============================================================

const publicClient =
  await viem.getPublicClient();

await publicClient.waitForTransactionReceipt({
  hash: transactionHash
});

console.log(
  "✅ Original event recorded on blockchain."
);

console.log(
  "Transaction Hash:",
  transactionHash
);


// ============================================================
// VERIFY ORIGINAL HASH
// ============================================================

const originalVerified =
  await cyberTwinAudit.read.verifyEvent([
    eventId,
    originalHash
  ]);


// ============================================================
// VERIFY TAMPERED HASH
// ============================================================

const tamperedVerified =
  await cyberTwinAudit.read.verifyEvent([
    eventId,
    tamperedHash
  ]);


// ============================================================
// DISPLAY RESULTS
// ============================================================

console.log("\n==========================================");
console.log("BLOCKCHAIN VERIFICATION");
console.log("==========================================");

console.log(
  "\nOriginal event verification:",
  originalVerified
    ? "✅ VERIFIED"
    : "❌ FAILED"
);

console.log(
  "Tampered event verification:",
  tamperedVerified
    ? "⚠️ ACCEPTED"
    : "🛡️ TAMPERING DETECTED"
);


// ============================================================
// FINAL RESULT
// ============================================================

console.log("\n==========================================");

if (
  originalVerified === true &&
  tamperedVerified === false
) {

  console.log(
    "RESULT: ✅ BLOCKCHAIN INTEGRITY PROTECTION WORKS"
  );

} else {

  console.log(
    "RESULT: ❌ INTEGRITY TEST FAILED"
  );
}

console.log("==========================================\n");