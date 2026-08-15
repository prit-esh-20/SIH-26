import { useState } from "react";
import {
  Fingerprint,
  FileLock,
  KeyRound,
  Layers,
  Lock,
  ShieldHalf,
  ShieldCheck,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import Switch from "../common/Switch";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import { toggleSecurityControl } from "../../services/controlService";

const CONTROL_ICONS = {
  mfa: Fingerprint,
  endpointProtection: ShieldCheck,
  networkSegmentation: Layers,
  leastPrivilege: KeyRound,
  passwordPolicy: Lock,
  vpnAuthentication: FileLock,
};

function SecurityControls({ controls, loading, error, onRetry }) {
  const [busyId, setBusyId] = useState(null);

  const handleToggle = async (control) => {
    if (busyId) return;
    setBusyId(control.id);
    try {
      await toggleSecurityControl(control.id);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingState variant="rows" />;
  if (error) return <ErrorState title="Unable to load security controls" onRetry={onRetry} />;

  return (
    <Card
      title="Security Controls"
      action={<Badge tone="neutral">{controls?.length} controls modeled</Badge>}
    >
      <div className="control-list">
        {controls?.map((control) => {
          const Icon = CONTROL_ICONS[control.id] ?? ShieldHalf;

          return (
            <div className="control-row" key={control.id}>
              <span className="control-row__icon" aria-hidden="true">
                <Icon size={16} />
              </span>

              <div className="control-row__body">
                <div className="control-row__name">{control.name}</div>
                <div className="control-row__desc">{control.description}</div>
              </div>

              <div className="control-row__meta">
                <Badge tone={control.enabled ? "success" : "neutral"}>
                  {control.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge tone="info">Impact {control.impact}</Badge>
                <Switch
                  checked={control.enabled}
                  disabled={busyId === control.id}
                  label={`Toggle ${control.name}`}
                  onChange={() => handleToggle(control)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default SecurityControls;
