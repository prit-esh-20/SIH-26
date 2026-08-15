/**
 * Deterministic attack simulation engine.
 *
 * Same inputs → same outputs, every time. No randomness.
 *
 * The required demo flow produces the documented values:
 *   Credential Leak · Rahul Sharma · MFA OFF → Risk 86, Blast 72%, 4 critical assets, 25,000 records
 *   Credential Leak · Rahul Sharma · MFA ON  → Risk 21, Blast 8%, 0 critical assets, 0 records
 *
 * When the backend is integrated, this module is replaced by POST /api/simulations
 * and POST /api/simulations/counterfactual.
 */

import { USERS, severityOf } from "./mockData";

const SCENARIO_DEFS = {
  credentialLeak: {
    id: "credentialLeak",
    primaryUser: "user-rahul",
    path: [
      { id: "node-user", label: "Rahul Sharma", type: "user" },
      { id: "node-laptop", label: "Rahul-Laptop", type: "device" },
      { id: "node-vpn", label: "VPN Gateway", type: "network" },
      { id: "node-fin-server", label: "Finance Server", type: "server", critical: true },
      { id: "node-fin-db", label: "Finance Database", type: "database", critical: true },
      { id: "node-data", label: "Financial Records", type: "data", critical: true },
    ],
    context: [
      { id: "node-hr-server", label: "HR Server", type: "server" },
      { id: "node-hr-db", label: "HR Database", type: "database", critical: true },
      { id: "node-backup", label: "Backup Storage", type: "storage", critical: true },
    ],
    baseline: { risk: 86, blastRadius: 72, criticalAssets: 4, records: 25000 },
    mfaOn: { risk: 21, blastRadius: 8, criticalAssets: 0, records: 0, blockedAt: "VPN Gateway" },
    controls: {
      endpointProtection: { risk: 52, blastRadius: 40, criticalAssets: 2, records: 10000, blockedAt: "Finance Server" },
      networkSegmentation: { risk: 45, blastRadius: 30, criticalAssets: 1, records: 8000, blockedAt: "Finance Server" },
      leastPrivilege: { risk: 58, blastRadius: 45, criticalAssets: 2, records: 12000, blockedAt: null },
      passwordPolicy: { risk: 62, blastRadius: 48, criticalAssets: 2, records: 14000, blockedAt: null },
      vpnAuthentication: { risk: 55, blastRadius: 38, criticalAssets: 2, records: 9000, blockedAt: "VPN Gateway" },
    },
  },
  compromisedAdmin: {
    id: "compromisedAdmin",
    primaryUser: "user-neha",
    path: [
      { id: "node-user", label: "Neha Kapoor", type: "user" },
      { id: "node-admin-laptop", label: "Admin-Laptop", type: "device" },
      { id: "node-vpn", label: "VPN Gateway", type: "network" },
      { id: "node-internal", label: "Internal Network", type: "network", critical: true },
      { id: "node-dc", label: "Domain Controller", type: "server", critical: true },
    ],
    context: [
      { id: "node-fin-db", label: "Finance Database", type: "database", critical: true },
      { id: "node-hr-db", label: "HR Database", type: "database", critical: true },
      { id: "node-backup", label: "Backup Storage", type: "storage", critical: true },
    ],
    baseline: { risk: 94, blastRadius: 85, criticalAssets: 5, records: 25000 },
    mfaOn: { risk: 44, blastRadius: 30, criticalAssets: 2, records: 8000, blockedAt: "Internal Network" },
    controls: {
      endpointProtection: { risk: 62, blastRadius: 45, criticalAssets: 3, records: 12000, blockedAt: "Domain Controller" },
      networkSegmentation: { risk: 58, blastRadius: 42, criticalAssets: 3, records: 10000, blockedAt: "Domain Controller" },
      leastPrivilege: { risk: 70, blastRadius: 55, criticalAssets: 4, records: 16000, blockedAt: null },
      passwordPolicy: { risk: 66, blastRadius: 50, criticalAssets: 4, records: 15000, blockedAt: null },
      vpnAuthentication: { risk: 49, blastRadius: 35, criticalAssets: 2, records: 9000, blockedAt: "Internal Network" },
    },
  },
  malwareInfection: {
    id: "malwareInfection",
    primaryUser: "user-arjun",
    path: [
      { id: "node-user", label: "Arjun Rao", type: "user" },
      { id: "node-arjun-laptop", label: "Arjun-Laptop", type: "device" },
      { id: "node-app", label: "Application Server", type: "server", critical: true },
      { id: "node-hr-db", label: "HR Database", type: "database", critical: true },
      { id: "node-data", label: "Employee Records", type: "data", critical: true },
    ],
    context: [
      { id: "node-vpn", label: "VPN Gateway", type: "network" },
      { id: "node-web", label: "Web Server", type: "server" },
      { id: "node-fin-db", label: "Finance Database", type: "database", critical: true },
    ],
    baseline: { risk: 68, blastRadius: 45, criticalAssets: 2, records: 8000 },
    mfaOn: { risk: 58, blastRadius: 38, criticalAssets: 2, records: 7000, blockedAt: null },
    controls: {
      endpointProtection: { risk: 33, blastRadius: 15, criticalAssets: 0, records: 0, blockedAt: "Arjun-Laptop" },
      networkSegmentation: { risk: 41, blastRadius: 25, criticalAssets: 1, records: 3000, blockedAt: "Application Server" },
      leastPrivilege: { risk: 44, blastRadius: 28, criticalAssets: 1, records: 2000, blockedAt: "HR Database" },
      passwordPolicy: { risk: 55, blastRadius: 35, criticalAssets: 1, records: 5000, blockedAt: null },
      vpnAuthentication: { risk: 56, blastRadius: 36, criticalAssets: 1, records: 6000, blockedAt: null },
    },
  },
  insiderThreat: {
    id: "insiderThreat",
    primaryUser: "user-priya",
    path: [
      { id: "node-user", label: "Priya Mehta", type: "user" },
      { id: "node-priya-laptop", label: "Priya-Laptop", type: "device" },
      { id: "node-hr-server", label: "HR Server", type: "server" },
      { id: "node-hr-db", label: "HR Database", type: "database", critical: true },
      { id: "node-data", label: "Employee Records", type: "data", critical: true },
    ],
    context: [
      { id: "node-vpn", label: "VPN Gateway", type: "network" },
      { id: "node-app", label: "Application Server", type: "server", critical: true },
      { id: "node-fin-db", label: "Finance Database", type: "database", critical: true },
    ],
    baseline: { risk: 74, blastRadius: 55, criticalAssets: 3, records: 12000 },
    mfaOn: { risk: 66, blastRadius: 48, criticalAssets: 2, records: 10000, blockedAt: null },
    controls: {
      endpointProtection: { risk: 63, blastRadius: 44, criticalAssets: 2, records: 9000, blockedAt: null },
      networkSegmentation: { risk: 52, blastRadius: 34, criticalAssets: 2, records: 6000, blockedAt: "HR Database" },
      leastPrivilege: { risk: 38, blastRadius: 22, criticalAssets: 1, records: 4000, blockedAt: "HR Database" },
      passwordPolicy: { risk: 58, blastRadius: 40, criticalAssets: 2, records: 8000, blockedAt: null },
      vpnAuthentication: { risk: 60, blastRadius: 42, criticalAssets: 2, records: 8500, blockedAt: null },
    },
  },
  phishing: {
    id: "phishing",
    primaryUser: "user-rahul",
    path: [
      { id: "node-user", label: "Rahul Sharma", type: "user" },
      { id: "node-laptop", label: "Rahul-Laptop", type: "device" },
      { id: "node-vpn", label: "VPN Gateway", type: "network" },
      { id: "node-web", label: "Web Server", type: "server" },
      { id: "node-app", label: "Application Server", type: "server", critical: true },
      { id: "node-fin-db", label: "Finance Database", type: "database", critical: true },
      { id: "node-data", label: "Financial Records", type: "data", critical: true },
    ],
    context: [
      { id: "node-hr-server", label: "HR Server", type: "server" },
      { id: "node-hr-db", label: "HR Database", type: "database", critical: true },
      { id: "node-backup", label: "Backup Storage", type: "storage", critical: true },
    ],
    baseline: { risk: 61, blastRadius: 38, criticalAssets: 1, records: 5000 },
    mfaOn: { risk: 12, blastRadius: 4, criticalAssets: 0, records: 0, blockedAt: "VPN Gateway" },
    controls: {
      endpointProtection: { risk: 44, blastRadius: 26, criticalAssets: 1, records: 2500, blockedAt: "Application Server" },
      networkSegmentation: { risk: 40, blastRadius: 22, criticalAssets: 0, records: 1500, blockedAt: "Application Server" },
      leastPrivilege: { risk: 36, blastRadius: 20, criticalAssets: 0, records: 1200, blockedAt: "Finance Database" },
      passwordPolicy: { risk: 46, blastRadius: 28, criticalAssets: 1, records: 3000, blockedAt: null },
      vpnAuthentication: { risk: 33, blastRadius: 16, criticalAssets: 0, records: 900, blockedAt: "VPN Gateway" },
    },
  },
};

const USER_FACTORS = {
  Critical: 1.1,
  High: 1.0,
  Medium: 0.9,
  Low: 0.75,
};

const MFA_EXTRA_REDUCTION = {
  endpointProtection: 0.35,
  networkSegmentation: 0.45,
  leastPrivilege: 0.25,
  passwordPolicy: 0.15,
  vpnAuthentication: 0.2,
  none: 0,
};

function applyExtraReduction(result, controlId) {
  const factor = MFA_EXTRA_REDUCTION[controlId] ?? 0;
  if (!factor) return result;

  const mul = 1 - factor;
  return {
    ...result,
    risk: Math.max(0, Math.round(result.risk * mul)),
    blastRadius: Math.max(0, Math.round(result.blastRadius * mul)),
    criticalAssets: Math.max(0, Math.round(result.criticalAssets * mul)),
    records: Math.max(0, Math.round(result.records * mul)),
  };
}

function buildPath(def, blockedAt) {
  let blockedIndex = -1;
  if (blockedAt) {
    blockedIndex = def.path.findIndex((n) => n.label === blockedAt);
  }

  return def.path.map((node, index) => {
    const blocked = index === blockedIndex;
    return {
      ...node,
      compromised: !blocked && (blockedIndex === -1 || index < blockedIndex),
      blocked,
    };
  });
}

/**
 * @param {object} config
 * @param {string} config.scenarioId
 * @param {string} config.userId
 * @param {boolean} config.mfa
 * @param {string} config.control  additional control id ("none" by default)
 */
export function simulateAttack(config) {
  const def = SCENARIO_DEFS[config.scenarioId];
  const user = USERS.find((u) => u.id === config.userId);
  if (!def || !user) {
    throw new Error(`Unknown scenario or user: ${config.scenarioId}/${config.userId}`);
  }

  const mfaOn = Boolean(config.mfa);
  const control = config.control ?? "none";

  let base;
  if (mfaOn) {
    base = def.mfaOn;
    base = applyExtraReduction(base, control);
  } else if (control === "mfa") {
    base = def.mfaOn;
  } else if (control !== "none" && def.controls[control]) {
    base = def.controls[control];
  } else {
    base = def.baseline;
  }

  const factor =
    config.userId === def.primaryUser ? 1.0 : USER_FACTORS[user.accessLevel] ?? 1.0;

  const result = {
    risk: Math.max(0, Math.round(base.risk * factor)),
    blastRadius: Math.max(0, Math.round(base.blastRadius * factor)),
    criticalAssets: Math.max(0, Math.round(base.criticalAssets * factor)),
    records: Math.max(0, Math.round(base.records * factor)),
    blockedAt: base.blockedAt ?? null,
  };

  return {
    id: config.simulationId,
    scenarioId: def.id,
    scenarioName: scenarioName(def.id),
    userName: user.name,
    userRole: user.role,
    mfa: mfaOn,
    control: mfaOn ? control : control === "mfa" ? "mfa" : control,
    ...result,
    severity: severityOf(result.risk),
    path: buildPath(def, result.blockedAt),
    graphContext: def.context,
    note: result.blockedAt
      ? `Attack path blocked at ${result.blockedAt}.`
      : "Attack path reached its target. No control stopped the movement.",
  };
}

/**
 * Counterfactual: re-run the same attack with an alternative control active.
 */
export function simulateCounterfactual(config) {
  const appliedControl = config.controlId ?? "mfa";
  const nextConfig = {
    ...config,
    mfa: appliedControl === "mfa" ? true : config.mfa,
    control: appliedControl === "mfa" ? "none" : appliedControl,
  };

  return simulateAttack(nextConfig);
}

export function scenarioName(id) {
  const names = {
    credentialLeak: "Credential Leak",
    compromisedAdmin: "Compromised Admin Account",
    malwareInfection: "Malware Infection",
    insiderThreat: "Insider Threat",
    phishing: "Phishing Compromise",
  };
  return names[id] ?? id;
}
