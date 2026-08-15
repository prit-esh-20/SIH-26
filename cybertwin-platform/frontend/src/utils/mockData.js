/**
 * Deterministic synthetic data for the CyberTwin demo environment.
 *
 * All values here are fictional and stable across renders/refreshes.
 * No Math.random() is used for primary values.
 *
 * This layer is intended to be replaced by real backend APIs through the
 * service layer (src/services) without rewriting any UI component.
 */

export const DEMO_ENVIRONMENT = {
  name: "ApexFin Technologies",
  industry: "Financial Services",
  environment: "Simulation",
  twinStatus: "Synchronized",
  description:
    "A synthetic mid-size financial services organization modeled as a digital twin. All users, devices and assets are fictional and generated for demonstration purposes.",
  departments: ["Finance", "HR", "Engineering", "IT"],
};

export const ORGANIZATION_OVERVIEW = {
  departments: 4,
  users: 12,
  devices: 12,
  servers: 6,
  databases: 2,
  criticalAssets: 4,
};

export const USERS = [
  {
    id: "user-rahul",
    name: "Rahul Sharma",
    department: "Finance",
    role: "Finance Analyst",
    device: "Rahul-Laptop",
    accessLevel: "Medium",
    mfa: "Disabled",
    risk: "High",
    status: "Active",
  },
  {
    id: "user-priya",
    name: "Priya Mehta",
    department: "HR",
    role: "HR Manager",
    device: "Priya-Laptop",
    accessLevel: "High",
    mfa: "Enabled",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "user-arjun",
    name: "Arjun Rao",
    department: "Engineering",
    role: "Software Engineer",
    device: "Arjun-Laptop",
    accessLevel: "Medium",
    mfa: "Enabled",
    risk: "Low",
    status: "Active",
  },
  {
    id: "user-neha",
    name: "Neha Kapoor",
    department: "IT",
    role: "System Administrator",
    device: "Admin-Laptop",
    accessLevel: "Critical",
    mfa: "Enabled",
    risk: "High",
    status: "Active",
  },
  {
    id: "user-vikram",
    name: "Vikram Singh",
    department: "Finance",
    role: "Senior Finance Analyst",
    device: "Vikram-Laptop",
    accessLevel: "High",
    mfa: "Enabled",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "user-ananya",
    name: "Ananya Iyer",
    department: "HR",
    role: "HR Executive",
    device: "Ananya-Laptop",
    accessLevel: "Medium",
    mfa: "Disabled",
    risk: "Low",
    status: "Active",
  },
  {
    id: "user-karan",
    name: "Karan Malhotra",
    department: "Engineering",
    role: "DevOps Engineer",
    device: "Karan-Laptop",
    accessLevel: "High",
    mfa: "Enabled",
    risk: "High",
    status: "Active",
  },
  {
    id: "user-sneha",
    name: "Sneha Reddy",
    department: "IT",
    role: "Security Analyst",
    device: "Sneha-Laptop",
    accessLevel: "High",
    mfa: "Enabled",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "user-aditya",
    name: "Aditya Nair",
    department: "Finance",
    role: "Finance Manager",
    device: "Aditya-Laptop",
    accessLevel: "High",
    mfa: "Enabled",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "user-meera",
    name: "Meera Joshi",
    department: "HR",
    role: "Payroll Specialist",
    device: "Meera-Laptop",
    accessLevel: "High",
    mfa: "Disabled",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "user-rohan",
    name: "Rohan Desai",
    department: "Engineering",
    role: "Backend Engineer",
    device: "Rohan-Laptop",
    accessLevel: "Medium",
    mfa: "Enabled",
    risk: "Low",
    status: "Active",
  },
  {
    id: "user-tanvi",
    name: "Tanvi Kulkarni",
    department: "IT",
    role: "Database Administrator",
    device: "Tanvi-Laptop",
    accessLevel: "Critical",
    mfa: "Enabled",
    risk: "High",
    status: "Active",
  },
];

export const DEVICES = [
  { id: "dev-rahul", name: "Rahul-Laptop", owner: "Rahul Sharma", os: "Windows 11", ip: "10.0.1.24", security: "Needs Review", lastSeen: "Today", risk: "High" },
  { id: "dev-priya", name: "Priya-Laptop", owner: "Priya Mehta", os: "Windows 11", ip: "10.0.1.31", security: "Compliant", lastSeen: "Today", risk: "Medium" },
  { id: "dev-arjun", name: "Arjun-Laptop", owner: "Arjun Rao", os: "macOS 15", ip: "10.0.2.44", security: "Compliant", lastSeen: "Today", risk: "Low" },
  { id: "dev-admin", name: "Admin-Laptop", owner: "Neha Kapoor", os: "Windows 11", ip: "10.0.0.10", security: "Compliant", lastSeen: "Today", risk: "High" },
  { id: "dev-vikram", name: "Vikram-Laptop", owner: "Vikram Singh", os: "Windows 11", ip: "10.0.1.27", security: "Needs Review", lastSeen: "Yesterday", risk: "Medium" },
  { id: "dev-ananya", name: "Ananya-Laptop", owner: "Ananya Iyer", os: "Windows 10", ip: "10.0.1.36", security: "Compliant", lastSeen: "2 days ago", risk: "Low" },
  { id: "dev-karan", name: "Karan-Laptop", owner: "Karan Malhotra", os: "Linux Ubuntu 24", ip: "10.0.2.50", security: "Compliant", lastSeen: "Today", risk: "High" },
  { id: "dev-sneha", name: "Sneha-Laptop", owner: "Sneha Reddy", os: "Windows 11", ip: "10.0.0.15", security: "Compliant", lastSeen: "Today", risk: "Medium" },
  { id: "dev-aditya", name: "Aditya-Laptop", owner: "Aditya Nair", os: "Windows 11", ip: "10.0.1.29", security: "Outdated", lastSeen: "3 days ago", risk: "Medium" },
  { id: "dev-meera", name: "Meera-Laptop", owner: "Meera Joshi", os: "Windows 10", ip: "10.0.1.38", security: "Needs Review", lastSeen: "Yesterday", risk: "Medium" },
  { id: "dev-rohan", name: "Rohan-Laptop", owner: "Rohan Desai", os: "macOS 14", ip: "10.0.2.46", security: "Compliant", lastSeen: "Today", risk: "Low" },
  { id: "dev-tanvi", name: "Tanvi-Laptop", owner: "Tanvi Kulkarni", os: "Windows 11", ip: "10.0.0.18", security: "Compliant", lastSeen: "Today", risk: "High" },
];

export const ASSETS = [
  { id: "asset-gateway", name: "Internet Gateway", type: "Network", criticality: "Medium", owner: "IT", exposure: "Public", risk: "Medium", status: "Active" },
  { id: "asset-vpn", name: "VPN Gateway", type: "Network", criticality: "High", owner: "IT", exposure: "Public", risk: "High", status: "Active" },
  { id: "asset-web", name: "Web Server", type: "Server", criticality: "Medium", owner: "Engineering", exposure: "Public", risk: "Medium", status: "Active" },
  { id: "asset-app", name: "Application Server", type: "Server", criticality: "High", owner: "Engineering", exposure: "Internal", risk: "High", status: "Active" },
  { id: "asset-finance-server", name: "Finance Server", type: "Server", criticality: "High", owner: "Finance", exposure: "Internal", risk: "High", status: "Active" },
  { id: "asset-hr-server", name: "HR Server", type: "Server", criticality: "Medium", owner: "HR", exposure: "Internal", risk: "Medium", status: "Active" },
  { id: "asset-email", name: "Email Server", type: "Server", criticality: "Medium", owner: "IT", exposure: "Internal", risk: "Low", status: "Active" },
  { id: "asset-dc", name: "Domain Controller", type: "Server", criticality: "Critical", owner: "IT", exposure: "Internal", risk: "Critical", status: "Active" },
  { id: "asset-finance-db", name: "Finance Database", type: "Database", criticality: "Critical", owner: "Finance", exposure: "Internal", risk: "Critical", status: "Active" },
  { id: "asset-hr-db", name: "HR Database", type: "Database", criticality: "High", owner: "HR", exposure: "Internal", risk: "High", status: "Active" },
  { id: "asset-network", name: "Internal Network", type: "Network", criticality: "Critical", owner: "IT", exposure: "Internal", risk: "Critical", status: "Active" },
  { id: "asset-backup", name: "Backup Storage", type: "Storage", criticality: "Critical", owner: "IT", exposure: "Restricted", risk: "Medium", status: "Active" },
];

export const DATA_ASSETS = [
  {
    id: "data-financial",
    classification: "Confidential",
    recordCount: 25000,
    criticality: "Critical",
    storage: "Finance Database",
    exposure: "Exposed",
    name: "Financial Records",
    description: "Ledgers, statements and settlement records used by the Finance department.",
  },
  {
    id: "data-customer",
    classification: "Confidential",
    recordCount: 40000,
    criticality: "Critical",
    storage: "Application Server",
    exposure: "Restricted",
    name: "Customer Records",
    description: "Fictional customer profiles used by the retail banking simulation.",
  },
  {
    id: "data-employee",
    classification: "Restricted",
    recordCount: 850,
    criticality: "High",
    storage: "HR Database",
    exposure: "Protected",
    name: "Employee Records",
    description: "Synthetic personnel records for the simulated workforce.",
  },
  {
    id: "data-transaction",
    classification: "Confidential",
    recordCount: 60000,
    criticality: "Critical",
    storage: "Finance Database",
    exposure: "Exposed",
    name: "Transaction Records",
    description: "Simulated financial transactions processed by the twin's systems.",
  },
  {
    id: "data-reports",
    classification: "Internal",
    recordCount: 320,
    criticality: "Medium",
    storage: "Finance Server",
    exposure: "Restricted",
    name: "Internal Reports",
    description: "Internal analysis reports, all fictional in content.",
  },
  {
    id: "data-payroll",
    classification: "Restricted",
    recordCount: 150,
    criticality: "High",
    storage: "HR Database",
    exposure: "Protected",
    name: "Payroll Records",
    description: "Synthetic payroll records for the simulated workforce.",
  },
];

export const SCENARIOS = [
  {
    id: "credentialLeak",
    name: "Credential Leak",
    description:
      "An attacker obtains a valid user's credentials and uses them to move laterally through the network toward sensitive data.",
    primaryUser: "user-rahul",
    recommendedControl: "mfa",
    tags: ["Lateral movement", "Credential abuse"],
  },
  {
    id: "compromisedAdmin",
    name: "Compromised Admin Account",
    description:
      "A privileged administrative account is compromised, giving the attacker broad reach across the internal network.",
    primaryUser: "user-neha",
    recommendedControl: "vpnAuthentication",
    tags: ["Privilege escalation", "Domain access"],
  },
  {
    id: "malwareInfection",
    name: "Malware Infection",
    description:
      "Malware executes on an endpoint and attempts to spread toward application servers and stored data.",
    primaryUser: "user-arjun",
    recommendedControl: "endpointProtection",
    tags: ["Endpoint", "Lateral movement"],
  },
  {
    id: "insiderThreat",
    name: "Insider Threat",
    description:
      "A legitimate user with elevated access copies and exfiltrates sensitive records from internal systems.",
    primaryUser: "user-priya",
    recommendedControl: "leastPrivilege",
    tags: ["Data exfiltration", "Insider"],
  },
  {
    id: "phishing",
    name: "Phishing Compromise",
    description:
      "A phishing campaign compromises a user session which is then used to pivot toward sensitive applications.",
    primaryUser: "user-rahul",
    recommendedControl: "mfa",
    tags: ["Social engineering", "Session abuse"],
  },
];

export const SECURITY_CONTROLS = [
  {
    id: "mfa",
    name: "Multi-Factor Authentication",
    shortName: "MFA",
    description: "Requires a second authentication factor at network entry points.",
    status: "Disabled",
    impact: "High",
    riskReduction: 65,
    affectedAssets: ["VPN Gateway", "Web Server", "Application Server"],
    defaultEnabled: false,
  },
  {
    id: "endpointProtection",
    name: "Endpoint Protection",
    shortName: "EDR",
    description: "Endpoint detection and response covering all managed devices.",
    status: "Enabled",
    impact: "High",
    riskReduction: 34,
    affectedAssets: ["All endpoint devices"],
    defaultEnabled: true,
  },
  {
    id: "networkSegmentation",
    name: "Network Segmentation",
    shortName: "Segmentation",
    description: "Isolates business-critical segments from general network traffic.",
    status: "Enabled",
    impact: "Medium",
    riskReduction: 41,
    affectedAssets: ["Finance Server", "Finance Database", "HR Server", "HR Database"],
    defaultEnabled: true,
  },
  {
    id: "leastPrivilege",
    name: "Least Privilege",
    shortName: "Least Privilege",
    description: "Restricts data access to the minimum required by each role.",
    status: "Enabled",
    impact: "Medium",
    riskReduction: 28,
    affectedAssets: ["Finance Database", "HR Database", "Application Server"],
    defaultEnabled: true,
  },
  {
    id: "passwordPolicy",
    name: "Password Policy",
    shortName: "Password Policy",
    description: "Enforces strong, rotated passwords across the organization.",
    status: "Enabled",
    impact: "Medium",
    riskReduction: 24,
    affectedAssets: ["VPN Gateway", "Email Server"],
    defaultEnabled: true,
  },
  {
    id: "vpnAuthentication",
    name: "VPN Authentication",
    shortName: "VPN Auth",
    description: "Validates device posture and identity before remote access.",
    status: "Enabled",
    impact: "High",
    riskReduction: 46,
    affectedAssets: ["VPN Gateway"],
    defaultEnabled: true,
  },
];

export const DASHBOARD_KPIS = [
  {
    id: "overall-risk",
    label: "Overall Risk",
    value: 72,
    unit: "/ 100",
    status: "High",
    statusTone: "high",
  },
  {
    id: "assets",
    label: "Assets",
    value: 128,
    unit: "",
    status: "Monitored",
    statusTone: "info",
  },
  {
    id: "critical-assets",
    label: "Critical Assets",
    value: 12,
    unit: "",
    status: "Protected: 9",
    statusTone: "success",
  },
  {
    id: "attack-paths",
    label: "Attack Paths",
    value: 14,
    unit: "",
    status: "High-risk: 5",
    statusTone: "warning",
  },
];

export const ATTACK_PATHS = [
  {
    id: "path-credential",
    name: "Credential Leak",
    path: ["Finance Analyst", "VPN", "Finance Server", "Finance DB"],
    risk: "High",
    impact: "Critical",
    description: "Stolen user credentials reach the Finance database segment.",
  },
  {
    id: "path-admin",
    name: "Compromised Admin Account",
    path: ["Admin", "VPN", "Internal Network", "Domain Controller"],
    risk: "Critical",
    impact: "Critical",
    description: "A privileged account grants access to domain infrastructure.",
  },
  {
    id: "path-insider",
    name: "Insider Data Exfiltration",
    path: ["HR Manager", "HR Server", "HR Database"],
    risk: "Medium",
    impact: "High",
    description: "Elevated HR access is used to copy personnel records.",
  },
  {
    id: "path-phishing",
    name: "Phishing Pivot",
    path: ["User", "Web Server", "Application Server"],
    risk: "Medium",
    impact: "High",
    description: "A compromised session pivots toward internal applications.",
  },
];

export const SECURITY_EVENTS = [
  { id: 1, time: "10:42", event: "Credential leak simulated", severity: "High", status: "Simulated" },
  { id: 2, time: "10:15", event: "MFA control enabled", severity: "Info", status: "Applied" },
  { id: 3, time: "09:58", event: "Critical asset exposed", severity: "Critical", status: "Open" },
  { id: 4, time: "09:30", event: "Attack path blocked", severity: "Info", status: "Blocked" },
  { id: 5, time: "09:12", event: "Risk score recalculated", severity: "Info", status: "Completed" },
  { id: 6, time: "08:47", event: "Simulation run completed", severity: "Info", status: "Completed" },
];

export const ML_USER_RISKS = [
  {
    user: "Rahul Sharma",
    userId: "user-rahul",
    score: 78,
    level: "High",
    confidence: 0.91,
    signals: [
      "Unusual login time (02:14 IST)",
      "New device detected",
      "Abnormal resource access pattern",
    ],
  },
  {
    user: "Neha Kapoor",
    userId: "user-neha",
    score: 82,
    level: "High",
    confidence: 0.88,
    signals: [
      "Privileged session at unusual hour",
      "Unusual administrative commands",
    ],
  },
  {
    user: "Karan Malhotra",
    userId: "user-karan",
    score: 64,
    level: "Medium",
    confidence: 0.84,
    signals: ["Increased deployment activity", "Access to new repositories"],
  },
  {
    user: "Tanvi Kulkarni",
    userId: "user-tanvi",
    score: 71,
    level: "High",
    confidence: 0.86,
    signals: ["Query pattern anomaly", "Direct database access outside schedule"],
  },
];

export const BLOCKCHAIN_EVIDENCE = {
  simulationId: "SIM-000123",
  event: "Credential Leak Simulation",
  timestamp: "2026-08-15 10:42 UTC",
  integrity: "Verified",
  hash: "0x8f3a9c41e7d02b6f5a8e4c1d9b0a7f3e2c5d8a4b",
  ledger: "Confirmed",
  block: 104832,
  description:
    "Simulation result, configuration and risk outcome recorded on the evidence ledger for auditability.",
};

export const SIMULATION_STEPS = [
  "Preparing Digital Twin...",
  "Building attack graph...",
  "Evaluating attack paths...",
  "Calculating blast radius...",
  "Calculating risk...",
  "Simulation complete.",
];

export const DEFAULT_ADDITIONAL_CONTROLS = [
  { id: "none", name: "None" },
  { id: "mfa", name: "Multi-Factor Authentication (MFA)" },
  { id: "endpointProtection", name: "Endpoint Protection" },
  { id: "networkSegmentation", name: "Network Segmentation" },
  { id: "leastPrivilege", name: "Least Privilege" },
  { id: "passwordPolicy", name: "Password Policy" },
  { id: "vpnAuthentication", name: "VPN Authentication" },
];

export function severityOf(score) {
  if (score >= 90) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function severityLabel(severity) {
  return severity.toUpperCase();
}
