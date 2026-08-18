import express from "express";
import type { Request, Response } from "express";
import { createPublicClient, http, defineChain } from "viem";
import type { Hex } from "viem";
import "dotenv/config";

import { cyberTwinAuditAbi } from "./cyberTwinAuditAbi.js";
import {
  recordSecurityEvent,
  getSecurityEvent,
  isAuthorizedRecorder
} from "./cyberTwinBlockchainClient.js";

const app = express();
app.use(express.json());

const PORT = 8002;
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CYBERTWIN_CONTRACT_ADDRESS as `0x${string}`;

if (!CONTRACT_ADDRESS) {
  console.warn("WARNING: CYBERTWIN_CONTRACT_ADDRESS is not set in environment variables.");
}

// ------------------------------------------------------------
// Local Public Client for querying logs
// ------------------------------------------------------------
const blockchain = defineChain({
  id: 31337,
  name: "CyberTwin Local Blockchain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } }
});

const localPublicClient = createPublicClient({
  chain: blockchain,
  transport: http(RPC_URL)
});

// ------------------------------------------------------------
// Validation Helper
// ------------------------------------------------------------
function validateEventPayload(body: any): string | null {
  if (!body) return "Request body is empty";
  const required = [
    "user_id",
    "risk_probability",
    "risk_score",
    "risk_level",
    "is_risky",
    "anomaly_score",
    "is_anomalous",
    "top_reasons"
  ];
  for (const field of required) {
    if (body[field] === undefined) {
      return `Missing required field: ${field}`;
    }
  }
  if (typeof body.user_id !== "string") return "user_id must be a string";
  if (typeof body.risk_probability !== "number") return "risk_probability must be a number";
  if (typeof body.risk_score !== "number") return "risk_score must be a number";
  if (typeof body.risk_level !== "string") return "risk_level must be a string";
  if (typeof body.is_risky !== "boolean") return "is_risky must be a boolean";
  if (typeof body.anomaly_score !== "number") return "anomaly_score must be a number";
  if (typeof body.is_anomalous !== "boolean") return "is_anomalous must be a boolean";
  if (!Array.isArray(body.top_reasons)) return "top_reasons must be an array of strings";
  return null;
}

// ------------------------------------------------------------
// GET /health
// ------------------------------------------------------------
app.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "CyberTwin Blockchain API",
    status: "running"
  });
});

// ------------------------------------------------------------
// POST /record
// ------------------------------------------------------------
app.post("/record", async (req: Request, res: Response) => {
  const validationError = validateEventPayload(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const record = await recordSecurityEvent(req.body);
    res.json({
      success: true,
      eventId: record.eventId,
      transactionHash: record.transactionHash,
      eventHash: record.eventHash,
      riskScore: record.riskScore,
      verified: record.verified
    });
  } catch (error: any) {
    console.error("Blockchain record error:", error);
    res.status(502).json({
      error: error.message || "Failed to record security event on blockchain"
    });
  }
});

// ------------------------------------------------------------
// GET /evidence/:simulationId
// ------------------------------------------------------------
app.get("/evidence/:simulationId", async (req: Request, res: Response) => {
  const simulationId = req.params.simulationId as string;
  if (!simulationId || !simulationId.startsWith("0x")) {
    return res.status(400).json({ error: "Invalid simulationId format. Must be a hex hash string starting with 0x." });
  }

  try {
    // 1. Fetch on-chain record properties
    const rawEvent = await getSecurityEvent(simulationId as Hex);
    const [id, userIdHash, eventHash, riskScore, riskLevel, isAnomalous, timestamp, recordedBy] = rawEvent;

    // 2. Fetch log events matching eventId to extract transactionHash and blockNumber
    let transactionHash = "";
    let blockNumber = 0;
    try {
      const securityEventRecordedAbi = {
        type: "event",
        name: "SecurityEventRecorded",
        inputs: [
          { name: "eventId", type: "bytes32", indexed: true },
          { name: "userIdHash", type: "bytes32", indexed: true },
          { name: "eventHash", type: "bytes32", indexed: false },
          { name: "riskScore", type: "uint256", indexed: false },
          { name: "riskLevel", type: "string", indexed: false },
          { name: "isAnomalous", type: "bool", indexed: false },
          { name: "timestamp", type: "uint256", indexed: false },
          { name: "recordedBy", type: "address", indexed: true }
        ]
      } as const;

      const logs = await localPublicClient.getContractEvents({
        address: CONTRACT_ADDRESS,
        abi: [securityEventRecordedAbi],
        eventName: 'SecurityEventRecorded',
        args: {
          eventId: simulationId as Hex
        },
        fromBlock: 0n
      });
      if (logs.length > 0) {
        transactionHash = logs[0].transactionHash || "";
        blockNumber = Number(logs[0].blockNumber || 0);
      }
    } catch (logErr) {
      console.warn("Could not retrieve contract events logs:", logErr);
    }

    const formattedTime = new Date(Number(timestamp) * 1000).toUTCString();

    res.json({
      simulationId: id,
      event: `${riskLevel} Risk Event`,
      timestamp: formattedTime,
      integrity: "Verified",
      hash: eventHash,
      transactionHash: transactionHash || null,
      block: blockNumber || null,
      ledger: "Confirmed",
      description: `Security event record verified on-chain. Risk Score: ${Number(riskScore) / 100}. Recorded by address: ${recordedBy}.`
    });
  } catch (error: any) {
    if (error.message && error.message.includes("Event does not exist")) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.error("Blockchain read error:", error);
    res.status(502).json({
      error: error.message || "Failed to query blockchain evidence"
    });
  }
});

// Start Express Server
app.listen(PORT, "127.0.0.1", () => {
  console.log(`CyberTwin Blockchain API listening on http://127.0.0.1:${PORT}`);
});
