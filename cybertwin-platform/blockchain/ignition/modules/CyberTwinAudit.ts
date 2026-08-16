import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CyberTwinAuditModule = buildModule(
  "CyberTwinAuditModule",
  (m) => {

    const cyberTwinAudit = m.contract(
      "CyberTwinAudit"
    );

    return {
      cyberTwinAudit,
    };
  }
);

export default CyberTwinAuditModule;