import { useState } from "react";
import {
  Building2,
  Database,
  FolderLock,
  HardDrive,
  Laptop,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";

import PageTitle from "../components/common/PageTitle";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import StatusIndicator from "../components/common/StatusIndicator";
import Tabs from "../components/common/Tabs";
import DataTable from "../components/common/DataTable";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import { useAsync } from "../hooks/useAsync";
import {
  getOrganization,
  getOverview,
  getUsers,
  getDevices,
  getAssets,
  getDataAssets,
} from "../services/organizationService";
import { formatNumber } from "../utils/format";

const TABS = [
  { id: "overview", label: "Overview", icon: ShieldCheck },
  { id: "users", label: "Users", icon: Users },
  { id: "devices", label: "Devices", icon: Laptop },
  { id: "assets", label: "Assets", icon: Server },
  { id: "data", label: "Sensitive Data", icon: FolderLock },
];

const OVERVIEW_CARDS = [
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "users", label: "Users", icon: Users },
  { key: "devices", label: "Devices", icon: Laptop },
  { key: "servers", label: "Servers", icon: Server },
  { key: "databases", label: "Databases", icon: Database },
  { key: "criticalAssets", label: "Critical Assets", icon: HardDrive },
];

const DEPARTMENT_ROLES = {
  Finance: ["Rahul Sharma", "Vikram Singh", "Aditya Nair"],
  HR: ["Priya Mehta", "Ananya Iyer", "Meera Joshi"],
  Engineering: ["Arjun Rao", "Karan Malhotra", "Rohan Desai"],
  IT: ["Neha Kapoor", "Sneha Reddy", "Tanvi Kulkarni"],
};

function RiskBadge({ level }) {
  if (!level) return <Badge tone="neutral">—</Badge>;
  return <Badge severity={level.toLowerCase()}>{level}</Badge>;
}

function StatusBadge({ value }) {
  const toneMap = {
    Active: "success",
    Inactive: "neutral",
    Blocked: "danger",
    Protected: "success",
    Exposed: "danger",
    Restricted: "info",
    Compliant: "success",
    "Needs Review": "warning",
    Outdated: "danger",
  };
  return <Badge tone={toneMap[value] ?? "neutral"}>{value}</Badge>;
}

function UsersTable() {
  const users = useAsync(getUsers);

  const columns = [
    { key: "name", header: "Name", primary: true },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
    { key: "device", header: "Device" },
    { key: "accessLevel", header: "Access Level" },
    { key: "mfa", header: "MFA" },
    { key: "risk", header: "Risk", render: (row) => <RiskBadge level={row.risk} /> },
    { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  if (users.loading) return <LoadingState variant="table" />;
  if (users.error)
    return <ErrorState title="Unable to load users" text={users.error.message} onRetry={users.retry} />;

  return <DataTable columns={columns} rows={users.data} rowKey="id" emptyTitle="No users found" />;
}

function DevicesTable() {
  const devices = useAsync(getDevices);

  const columns = [
    { key: "name", header: "Device", primary: true },
    { key: "owner", header: "Owner" },
    { key: "os", header: "OS" },
    { key: "ip", header: "IP" },
    { key: "security", header: "Security Status", render: (row) => <StatusBadge value={row.security} /> },
    { key: "lastSeen", header: "Last Seen" },
    { key: "risk", header: "Risk", render: (row) => <RiskBadge level={row.risk} /> },
  ];

  if (devices.loading) return <LoadingState variant="table" />;
  if (devices.error)
    return <ErrorState title="Unable to load devices" text={devices.error.message} onRetry={devices.retry} />;

  return <DataTable columns={columns} rows={devices.data} rowKey="id" emptyTitle="No devices found" />;
}

function AssetsTable() {
  const assets = useAsync(getAssets);

  const columns = [
    { key: "name", header: "Asset", primary: true },
    { key: "type", header: "Type" },
    { key: "criticality", header: "Criticality", render: (row) => <RiskBadge level={row.criticality} /> },
    { key: "owner", header: "Owner" },
    { key: "exposure", header: "Exposure", render: (row) => <StatusBadge value={row.exposure} /> },
    { key: "risk", header: "Risk", render: (row) => <RiskBadge level={row.risk} /> },
    { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  ];

  if (assets.loading) return <LoadingState variant="table" />;
  if (assets.error)
    return <ErrorState title="Unable to load assets" text={assets.error.message} onRetry={assets.retry} />;

  return <DataTable columns={columns} rows={assets.data} rowKey="id" emptyTitle="No assets found" />;
}

function SensitiveDataTable() {
  const dataAssets = useAsync(getDataAssets);

  const columns = [
    { key: "name", header: "Data Class", primary: true },
    { key: "classification", header: "Classification", render: (row) => <Badge tone="violet">{row.classification}</Badge> },
    {
      key: "recordCount",
      header: "Records",
      render: (row) => <span className="cell-primary">{formatNumber(row.recordCount)}</span>,
    },
    { key: "criticality", header: "Impact", render: (row) => <RiskBadge level={row.criticality} /> },
    { key: "storage", header: "Storage Asset" },
    { key: "exposure", header: "Exposure", render: (row) => <StatusBadge value={row.exposure} /> },
  ];

  return (
    <>
      {dataAssets.loading ? (
        <LoadingState variant="table" />
      ) : dataAssets.error ? (
        <ErrorState
          title="Unable to load sensitive data"
          text={dataAssets.error.message}
          onRetry={dataAssets.retry}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={dataAssets.data}
            rowKey="id"
            emptyTitle="No data classes found"
          />
          <div className="data-tab-note">
            All records are synthetic placeholders generated for the demonstration —
            no real personal or financial data is stored or processed.
          </div>
        </>
      )}
    </>
  );
}

function OverviewTab({ overview }) {
  return (
    <div className="org-overview-grid">
      <div className="section-grid grid-2">
        {OVERVIEW_CARDS.map((card) => {
          const Icon = card.icon;
          const value = overview?.[card.key];
          return (
            <Card key={card.key} className="metric-card">
              <div className="metric-card__top">
                <span className="metric-card__label">{card.label}</span>
                <span className="metric-card__icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
              </div>
              <div className="metric-card__value">
                <span className="metric-card__number">{value ?? "—"}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Departments" action={<Badge tone="neutral">Modeled in twin</Badge>}>
        <div className="department-list">
          {Object.entries(DEPARTMENT_ROLES).map(([department, members]) => (
            <div className="department-row" key={department}>
              <span className="department-row__name">
                <Building2 size={14} />
                {department}
              </span>
              <span className="department-row__count">
                {members.length} members · {members.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Organization() {
  const [activeTab, setActiveTab] = useState("overview");

  const organization = useAsync(getOrganization);
  const overview = useAsync(getOverview);

  return (
    <div className="page">
      <PageTitle
        title="Organization"
        subtitle="Explore the simulated organization's users, devices, infrastructure, and sensitive assets."
        actions={
          organization.data ? (
            <>
              <StatusIndicator tone="info" label={`Environment: ${organization.data.environment}`} />
              <StatusIndicator tone="success" label={`Digital Twin: ${organization.data.twinStatus}`} />
            </>
          ) : (
            <StatusIndicator tone="neutral" label="Digital Twin: Syncing…" />
          )
        }
      />

      <Card>
        {organization.loading || !organization.data ? (
          <LoadingState />
        ) : (
          <div className="org-profile">
            <div>
              <div className="org-profile__head">
                <span className="org-profile__logo" aria-hidden="true">
                  <Building2 size={22} />
                </span>
                <div>
                  <div className="org-profile__name">{organization.data.name}</div>
                  <div className="field-hint">Digital twin of the organization</div>
                </div>
              </div>
              <p className="org-profile__desc">{organization.data.description}</p>
            </div>

            <div className="org-profile__meta">
              <div className="key-value">
                <span className="key-value__key">Industry</span>
                <span className="key-value__value">{organization.data.industry}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Environment</span>
                <span className="key-value__value">{organization.data.environment}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Twin status</span>
                <span className="key-value__value">{organization.data.twinStatus}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="org-tabs-row">
        <Tabs items={TABS} activeId={activeTab} onChange={setActiveTab} aria-label="Organization sections" />

        {activeTab === "overview" && (
          <Button variant="secondary" size="sm" icon={ShieldCheck} to="/simulation">
            Run attack simulation
          </Button>
        )}
      </div>

      {activeTab === "overview" && <OverviewTab overview={overview.data} />}
      {activeTab === "users" && <UsersTable />}
      {activeTab === "devices" && <DevicesTable />}
      {activeTab === "assets" && <AssetsTable />}
      {activeTab === "data" && <SensitiveDataTable />}
    </div>
  );
}

export default Organization;
