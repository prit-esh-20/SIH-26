import PageTitle from "../components/common/PageTitle";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import { useAsync } from "../hooks/useAsync";
import { getOrganization } from "../services/organizationService";
import { getSecurityControls } from "../services/controlService";
import { API_BASE_URL, USE_MOCK } from "../services/api";

function Settings() {
  const organization = useAsync(getOrganization);
  const controls = useAsync(getSecurityControls);

  const enabledCount = controls.data?.filter((c) => c.enabled).length ?? 0;

  return (
    <div className="page">
      <PageTitle
        title="Settings"
        subtitle="Configure how CyberTwin models the organization and runs its simulations."
      />

      <div className="settings-grid">
        <Card title="Organization">
          {organization.loading ? (
            <LoadingState variant="rows" />
          ) : organization.error ? (
            <ErrorState onRetry={organization.retry} />
          ) : (
            <div className="key-value-list">
              <div className="key-value">
                <span className="key-value__key">Name</span>
                <span className="key-value__value">{organization.data.name}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Industry</span>
                <span className="key-value__value">{organization.data.industry}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Environment</span>
                <span className="key-value__value">{organization.data.environment}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Digital twin</span>
                <span className="key-value__value">{organization.data.twinStatus}</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="Simulation">
          <div className="key-value-list">
            <div className="key-value">
              <span className="key-value__key">Default scenario</span>
              <span className="key-value__value">Credential Leak</span>
            </div>
            <div className="key-value">
              <span className="key-value__key">Deterministic results</span>
              <Badge tone="success">Enabled</Badge>
            </div>
            <div className="key-value">
              <span className="key-value__key">Result labeling</span>
              <div className="card-actions">
                <Badge tone="violet">SIMULATED</Badge>
                <Badge tone="success">VERIFIED</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Security Controls">
          {controls.loading ? (
            <LoadingState variant="rows" />
          ) : controls.error ? (
            <ErrorState onRetry={controls.retry} />
          ) : (
            <div className="key-value-list">
              <div className="key-value">
                <span className="key-value__key">Modeled controls</span>
                <span className="key-value__value">{controls.data.length}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Enabled</span>
                <span className="key-value__value">{enabledCount}</span>
              </div>
              <div className="key-value">
                <span className="key-value__key">Disabled</span>
                <span className="key-value__value">{controls.data.length - enabledCount}</span>
              </div>
              <div className="field-hint">
                Toggle controls from the Risk Analysis page — the digital twin recomputes
                posture automatically.
              </div>
            </div>
          )}
        </Card>

        <Card title="Appearance">
          <div className="key-value-list">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">Enterprise Light Theme</div>
                <div className="settings-row__hint">
                  Professional light theme, optimized for enterprise cybersecurity risk
                  analysis and SOC dashboard operations.
                </div>
              </div>
              <Badge tone="info">Active</Badge>
            </div>
          </div>
        </Card>

        <Card title="System Information" className="span-2">
          <div className="key-value-list">
            <div className="key-value">
              <span className="key-value__key">Product</span>
              <span className="key-value__value">CyberTwin v0.1.0</span>
            </div>
            <div className="key-value">
              <span className="key-value__key">Data source</span>
              <Badge tone={USE_MOCK ? "warning" : "success"}>
                {USE_MOCK ? "Demo mode (synthetic)" : "Backend API"}
              </Badge>
            </div>
            <div className="key-value">
              <span className="key-value__key">API base URL</span>
              <span className="key-value__value">{API_BASE_URL}</span>
            </div>
            <div className="key-value">
              <span className="key-value__key">Evidence layer</span>
              <Badge tone="success">Blockchain-backed (backend)</Badge>
            </div>
            <div className="key-value">
              <span className="key-value__key">Intelligence layer</span>
              <Badge tone="violet">ML-assisted (backend)</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
