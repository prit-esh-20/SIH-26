# CyberTwin Blockchain Handoff

## Smart Contract

Contract:
CyberTwinAudit.sol

Purpose:
Stores cryptographic proofs of CyberTwin ML security events.

---

## Stored Security Event

Each event contains:

- eventId
- userIdHash
- eventHash
- riskScore
- riskLevel
- isAnomalous
- timestamp
- recordedBy

---

## Risk Score Representation

The ML system produces a risk score between 0 and 100
with two decimal places.

The blockchain stores the score as an integer scaled by 100.

Examples:

98.46 → 9846
70.87 → 7087
3.58  → 358
100.00 → 10000

To display the original ML score:

storedRiskScore / 100

---

## Event Integrity

The complete ML event is serialized into canonical JSON.

A SHA-256 hash is generated:

ML Event
↓
JSON
↓
SHA-256
↓
bytes32 eventHash

The eventHash is stored on-chain.

---

## Recording

The reusable service exposes:

recordSecurityEvent(event)

It:

1. Generates an event ID.
2. Hashes the ML event.
3. Hashes the user ID.
4. Converts the risk score.
5. Sends the event to CyberTwinAudit.
6. Waits for blockchain confirmation.
7. Verifies the stored hash.

---

## Verification

The service exposes:

verifySecurityEvent(eventId, event)

The event is hashed again and compared with
the hash stored on-chain.

Result:

true  → event integrity verified
false → possible tampering

---

## Environment Configuration

Create a local `.env` file:

CYBERTWIN_CONTRACT_ADDRESS=<deployed contract address>

Do not commit `.env`.

Use `.env.example` for GitHub.

---

## Local Blockchain

Development blockchain:

http://127.0.0.1:8545

Start:

npx hardhat node

---

## Contract Deployment

npx hardhat ignition deploy ignition/modules/CyberTwinAudit.ts --network localhost

---

## Tests

Run:

npx hardhat test

Expected:

7 passing

---

## Important Backend Integration Rule

The backend should NOT duplicate:

- SHA-256 event hashing
- user ID hashing
- event ID generation
- risk-score conversion
- blockchain verification logic

Use the blockchain service instead.

Expected flow:

ML API
↓
Backend
↓
recordSecurityEvent(mlResult)
↓
Blockchain
↓
Return transaction/event information