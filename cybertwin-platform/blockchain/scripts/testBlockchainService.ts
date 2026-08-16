import {
  recordSecurityEvent,
  verifySecurityEvent
} from "../services/cyberTwinBlockchain.js";


// ============================================================
// SAMPLE CYBERTWIN ML RESULT
// ============================================================

const mlResult = {
  user_id: "USER_00099",

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
// HEADER
// ============================================================

console.log("\n==========================================");
console.log("CYBERTWIN BLOCKCHAIN SERVICE TEST");
console.log("==========================================");


// ============================================================
// RECORD EVENT
// ============================================================

console.log("\nRecording ML security event...");

const result =
  await recordSecurityEvent(
    mlResult
  );


// ============================================================
// DISPLAY RESULT
// ============================================================

console.log("\n==========================================");
console.log("BLOCKCHAIN RESULT");
console.log("==========================================");

console.log(
  "Event ID        :",
  result.eventId
);

console.log(
  "Transaction Hash:",
  result.transactionHash
);

console.log(
  "Event Hash      :",
  result.eventHash
);

console.log(
  "Risk Score      :",
  result.riskScore
);

console.log(
  "Verified        :",
  result.verified
);


// ============================================================
// VERIFY AGAIN
// ============================================================

console.log("\n==========================================");
console.log("SECOND VERIFICATION");
console.log("==========================================");

const verified =
  await verifySecurityEvent(
    result.eventId,
    mlResult
  );

console.log(
  "Verification    :",
  verified
    ? "✅ VERIFIED"
    : "❌ FAILED"
);


// ============================================================
// FINAL RESULT
// ============================================================

console.log("\n==========================================");

if (
  result.verified &&
  verified
) {

  console.log(
    "RESULT: ✅ BLOCKCHAIN SERVICE WORKS"
  );

} else {

  console.log(
    "RESULT: ❌ BLOCKCHAIN SERVICE FAILED"
  );
}

console.log("==========================================\n");