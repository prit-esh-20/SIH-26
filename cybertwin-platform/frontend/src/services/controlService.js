import { api, USE_MOCK, mockDelay } from "./api";
import { SECURITY_CONTROLS } from "../utils/mockData";
import { getControls, toggleControl, setControl } from "../utils/twinStore";

function controlsWithStatus() {
  const state = getControls();
  return SECURITY_CONTROLS.map((control) => ({
    ...control,
    enabled: state[control.id] ?? false,
    status: state[control.id] ? "Enabled" : "Disabled",
  }));
}

export async function getSecurityControls() {
  if (USE_MOCK) {
    await mockDelay(300);
    return controlsWithStatus();
  }
  const response = await api.get("/security-controls");
  return response.data;
}

/**
 * Toggles a control and returns the updated list plus the recomputed posture.
 */
export async function toggleSecurityControl(id) {
  if (USE_MOCK) {
    await mockDelay(350);
    toggleControl(id);
    return controlsWithStatus();
  }
  const response = await api.post(`/security-controls/${id}/toggle`);
  return response.data;
}

export async function setSecurityControl(id, enabled) {
  if (USE_MOCK) {
    await mockDelay(250);
    setControl(id, enabled);
    return controlsWithStatus();
  }
  const response = await api.post(`/security-controls/${id}/toggle`, { enabled });
  return response.data;
}
