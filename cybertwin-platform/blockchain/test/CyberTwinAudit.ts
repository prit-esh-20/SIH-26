import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

const { viem } = await network.create();

describe("CyberTwinAudit", async function () {

  async function deployContract() {
    const cyberTwinAudit =
      await viem.deployContract("CyberTwinAudit");

    return cyberTwinAudit;
  }


  // ==========================================================
  // 1. DEPLOYMENT
  // ==========================================================

  await it("should deploy successfully", async function () {

    const cyberTwinAudit =
      await deployContract();

    const owner =
      await cyberTwinAudit.read.owner();

    assert.notEqual(
      owner,
      "0x0000000000000000000000000000000000000000"
    );
  });


  // ==========================================================
  // 2. AUTHORIZATION
  // ==========================================================

  await it(
    "should authorize the deployer as a recorder",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const [account] =
        await viem.getWalletClients();

      const isAuthorized =
        await cyberTwinAudit.read.authorizedRecorders([
          account.account.address
        ]);

      assert.equal(
        isAuthorized,
        true
      );
    }
  );


  // ==========================================================
  // 3. RECORD SECURITY EVENT
  // ==========================================================

  await it(
    "should record a security event",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const eventId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      const userIdHash =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      const eventHash =
        "0x3333333333333333333333333333333333333333333333333333333333333333";

      await cyberTwinAudit.write.recordSecurityEvent([
        eventId,
        userIdHash,
        eventHash,
        98n,
        "CRITICAL",
        true
      ]);

      const exists =
        await cyberTwinAudit.read.eventExists([
          eventId
        ]);

      assert.equal(
        exists,
        true
      );
    }
  );


  // ==========================================================
  // 4. CORRECT HASH VERIFICATION
  // ==========================================================

  await it(
    "should verify a correctly stored event hash",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const eventId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      const userIdHash =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      const eventHash =
        "0x3333333333333333333333333333333333333333333333333333333333333333";

      await cyberTwinAudit.write.recordSecurityEvent([
        eventId,
        userIdHash,
        eventHash,
        98n,
        "CRITICAL",
        true
      ]);

      const verified =
        await cyberTwinAudit.read.verifyEvent([
          eventId,
          eventHash
        ]);

      assert.equal(
        verified,
        true
      );
    }
  );


  // ==========================================================
  // 5. TAMPER DETECTION
  // ==========================================================

  await it(
    "should reject a tampered event hash",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const eventId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      const userIdHash =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      const originalHash =
        "0x3333333333333333333333333333333333333333333333333333333333333333";

      const tamperedHash =
        "0x4444444444444444444444444444444444444444444444444444444444444444";

      await cyberTwinAudit.write.recordSecurityEvent([
        eventId,
        userIdHash,
        originalHash,
        98n,
        "CRITICAL",
        true
      ]);

      const verified =
        await cyberTwinAudit.read.verifyEvent([
          eventId,
          tamperedHash
        ]);

      assert.equal(
        verified,
        false
      );
    }
  );


  // ==========================================================
  // 6. DUPLICATE EVENT PROTECTION
  // ==========================================================

  await it(
    "should reject duplicate event IDs",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const eventId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      const userIdHash =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      const eventHash =
        "0x3333333333333333333333333333333333333333333333333333333333333333";

      await cyberTwinAudit.write.recordSecurityEvent([
        eventId,
        userIdHash,
        eventHash,
        98n,
        "CRITICAL",
        true
      ]);

      await assert.rejects(
        async () => {

          await cyberTwinAudit.write.recordSecurityEvent([
            eventId,
            userIdHash,
            eventHash,
            98n,
            "CRITICAL",
            true
          ]);

        }
      );
    }
  );


  // ==========================================================
  // 7. RISK SCORE VALIDATION
  // ==========================================================

  await it(
    "should reject risk scores above 100",
    async function () {

      const cyberTwinAudit =
        await deployContract();

      const eventId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      const userIdHash =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      const eventHash =
        "0x3333333333333333333333333333333333333333333333333333333333333333";

      await assert.rejects(
        async () => {

          await cyberTwinAudit.write.recordSecurityEvent([
            eventId,
            userIdHash,
            eventHash,
            10001n,
            "CRITICAL",
            true
          ]);

        }
      );
    }
  );

});