import {
  recordSecurityEvent,
  verifySecurityEvent
} from "../services/cyberTwinBlockchainClient.js";


const mlResult = {

  user_id: "USER_BACKEND_TEST",

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


console.log("\n==========================================");
console.log("CYBERTWIN BACKEND BLOCKCHAIN TEST");
console.log("==========================================");


console.log("\nRecording event...");


const result =
  await recordSecurityEvent(
    mlResult
  );


console.log("\nEvent ID:");
console.log(
  result.eventId
);


console.log("\nTransaction Hash:");
console.log(
  result.transactionHash
);


console.log("\nEvent Hash:");
console.log(
  result.eventHash
);


console.log("\nRisk Score:");
console.log(
  result.riskScore
);


console.log("\nBlockchain Verification:");
console.log(
  result.verified
    ? "✅ VERIFIED"
    : "❌ FAILED"
);


// ============================================================
// SECOND VERIFICATION
// ============================================================

const verified =
  await verifySecurityEvent(
    result.eventId,
    mlResult
);


console.log("\n==========================================");
console.log("SECOND VERIFICATION");
console.log("==========================================");

console.log(
  verified
    ? "✅ VERIFIED"
    : "❌ FAILED"
);


console.log("\n==========================================");


if (
  result.verified &&
  verified
) {

  console.log(
    "RESULT: ✅ BACKEND BLOCKCHAIN CLIENT WORKS"
  );

} else {

  console.log(
    "RESULT: ❌ BACKEND BLOCKCHAIN CLIENT FAILED"
  );
}


console.log("==========================================\n");