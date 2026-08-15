import { api, USE_MOCK, mockDelay } from "./api";
import { DASHBOARD_KPIS, ATTACK_PATHS, SECURITY_EVENTS, severityOf } from "../utils/mockData";
import {
  getControls,
  computeOverallRisk,
  computeBlastRadius,
  computeProtectedCritical,
} from "../utils/twinStore";

const clone = (data) => JSON.parse(JSON.stringify(data));

const CATEGORY_DEFS = [
  {
    id: "identity",
    name: "Identity Risk",
    base: 70,
    deductions: { passwordPolicy: 2, vpnAuthentication: 4, mfa: 4 },
    explanation:
      "Credential-based access to critical systems relies on weak or missing second-factor authentication.",
    affected: ["VPN Gateway", "Web Server"],
    attackPath: "User → VPN → Finance Server",
    reason: "MFA is disabled for the Finance Analyst role and password hygiene is uneven.",
    recommendation: "Enable MFA for all VPN and privileged access.",
    topRisk: {
      name: "Credential Exposure",
      severity: "High",
      score: 86,
      affectedAssets: ["Finance Server", "Finance Database"],
      attackPath: "Rahul Sharma → Rahul-Laptop → VPN → Finance Server → Finance Database",
      reason: "A single leaked credential reaches the Finance segment end-to-end.",
      recommendedControl: "Enable MFA for VPN access.",
    },
  },
  {
    id: "network",
    name: "Network Risk",
    base: 88,
    deductions: { vpnAuthentication: 5, networkSegmentation: 5 },
    explanation:
      "Public-facing gateways are reachable from the internet and internal segments allow broad lateral movement.",
    affected: ["Internet Gateway", "VPN Gateway", "Internal Network"],
    attackPath: "Internet → VPN → Internal Network",
    reason: "Segmentation exists but the Finance segment remains reachable from user zones.",
    recommendation: "Enforce strict segmentation between user and critical segments.",
    topRisk: {
      name: "Lateral Movement",
      severity: "High",
      score: 78,
      affectedAssets: ["VPN Gateway", "Internal Network"],
      attackPath: "VPN Gateway → Internal Network → Finance Server",
      reason: "Compromised user sessions can traverse the network without restriction.",
      recommendedControl: "Add segment-level access rules on the VPN gateway.",
    },
  },
  {
    id: "endpoint",
    name: "Endpoint Risk",
    base: 72,
    deductions: { endpointProtection: 3 },
    explanation:
      "Managed devices vary in patch state and several laptops remain out of compliance.",
    affected: ["All managed devices"],
    attackPath: "Device → Corporate Network",
    reason: "Multiple devices are flagged 'needs review' with outdated operating systems.",
    recommendation: "Bring all devices to compliance before allowing data access.",
    topRisk: {
      name: "Unpatched Endpoint",
      severity: "Medium",
      score: 69,
      affectedAssets: ["Aditya-Laptop", "Ananya-Laptop"],
      attackPath: "Device → VPN → Internal Network",
      reason: "Outdated endpoints are a common malware entry point.",
      recommendedControl: "Enforce patch policy on all managed devices.",
    },
  },
  {
    id: "application",
    name: "Application Risk",
    base: 64,
    deductions: { endpointProtection: 3 },
    explanation:
      "Application servers host customer data and are reachable from the web tier.",
    affected: ["Web Server", "Application Server"],
    attackPath: "Web Server → Application Server",
    reason: "The web tier can reach the application server without additional checks.",
    recommendation: "Apply per-application authentication between tiers.",
    topRisk: {
      name: "Web-to-App Pivot",
      severity: "Medium",
      score: 61,
      affectedAssets: ["Web Server", "Application Server"],
      attackPath: "User → Web Server → Application Server",
      reason: "A compromised web session can reach application data.",
      recommendedControl: "Authenticate inter-tier traffic.",
    },
  },
  {
    id: "data",
    name: "Data Risk",
    base: 85,
    deductions: { networkSegmentation: 3 },
    explanation:
      "Critical financial assets are reachable through the current attack path.",
    affected: ["Finance Database", "Finance Server"],
    attackPath: "Finance Server → Finance Database",
    reason: "Financial records sit behind the Finance Server with no data-level control.",
    recommendation: "Apply data-level access controls and encryption.",
    topRisk: {
      name: "Sensitive Data Exposure",
      severity: "High",
      score: 82,
      affectedAssets: ["Finance Database"],
      attackPath: "Finance Server → Finance Database",
      reason: "25,000 financial records are exposed in the credential leak simulation.",
      recommendedControl: "Enable MFA to block the path at the VPN.",
    },
  },
  {
    id: "privilege",
    name: "Privilege Risk",
    base: 75,
    deductions: { leastPrivilege: 4 },
    explanation:
      "Several roles hold broader access than their function requires.",
    affected: ["Finance Database", "HR Database"],
    attackPath: "Role → Data Asset",
    reason: "Finance analysts retain write access to the full database.",
    recommendation: "Reduce role access to minimum required permissions.",
    topRisk: {
      name: "Excessive Privilege",
      severity: "High",
      score: 71,
      affectedAssets: ["Finance Database", "HR Database"],
      attackPath: "Finance Analyst → Finance Database",
      reason: "The Finance Analyst role can read the full financial dataset.",
      recommendedControl: "Apply least privilege to the Finance Analyst role.",
    },
  },
];

function computeCategories(controlState) {
  return CATEGORY_DEFS.map((def) => {
    let score = def.base;
    Object.entries(def.deductions).forEach(([controlId, amount]) => {
      if (controlState[controlId]) score -= amount;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      id: def.id,
      name: def.name,
      score,
      severity: severityOf(score),
      explanation: def.explanation,
      affectedAssets: def.affected,
      attackPath: def.attackPath,
      reason: def.reason,
      recommendation: def.recommendation,
      topRisk: {
        ...def.topRisk,
        score: Math.min(100, Math.max(score, def.topRisk.score - 12)),
        severity: severityOf(Math.min(100, Math.max(score, def.topRisk.score - 12))),
      },
    };
  });
}

async function overviewFromApi() {
  const response = await api.get("/risk");
  return response.data;
}

async function categoriesFromApi() {
  const response = await api.get("/risk/categories");
  return response.data;
}

async function eventsFromApi() {
  const response = await api.get("/risk/events");
  return response.data;
}

async function pathsFromApi() {
  const response = await api.get("/risk/attack-paths");
  return response.data;
}

export async function getRiskOverview() {
  if (USE_MOCK) {
    await mockDelay(300);
    const controls = getControls();
    const overallRisk = computeOverallRisk(controls);

    return {
      overallRisk,
      severity: severityOf(overallRisk),
      blastRadius: computeBlastRadius(controls),
      criticalAssets: 12,
      protectedCritical: computeProtectedCritical(controls),
      attackSurface: 128,
      categories: computeCategories(controls),
    };
  }
  return overviewFromApi();
}

export async function getRiskCategories() {
  if (USE_MOCK) {
    await mockDelay(300);
    return computeCategories(getControls());
  }
  return categoriesFromApi();
}

export async function getRiskDetail(id) {
  if (USE_MOCK) {
    await mockDelay(250);
    const category = computeCategories(getControls()).find((c) => c.id === id);
    return category ?? null;
  }
  const response = await api.get(`/risk/${id}`);
  return response.data;
}

export async function getAttackPaths() {
  if (USE_MOCK) {
    await mockDelay(250);
    return clone(ATTACK_PATHS);
  }
  return pathsFromApi();
}

export async function getSecurityEvents() {
  if (USE_MOCK) {
    await mockDelay(250);
    return clone(SECURITY_EVENTS);
  }
  return eventsFromApi();
}

export async function getDashboardKpis() {
  if (USE_MOCK) {
    await mockDelay(250);
    const controls = getControls();
    const kpis = clone(DASHBOARD_KPIS);
    kpis[0].value = computeOverallRisk(controls);
    kpis[2].status = `Protected: ${computeProtectedCritical(controls)}`;
    return kpis;
  }
  const response = await api.get("/dashboard/kpis");
  return response.data;
}
