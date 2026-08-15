/**
 * Lightweight deterministic store for the demo digital twin.
 *
 * Holds the enabled/disabled state of security controls plus a small
 * simulation history. Values are derived deterministically so the demo
 * behaves consistently across pages and refreshes.
 *
 * When the backend is integrated, this store is replaced by API state and
 * the services (src/services) become the single source of truth.
 */

import { SECURITY_CONTROLS } from "./mockData";

const initialControls = {};
SECURITY_CONTROLS.forEach((control) => {
  initialControls[control.id] = control.defaultEnabled;
});

let controls = { ...initialControls };
let simulationIdCounter = 123;
let history = [];

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getControls() {
  return { ...controls };
}

export function setControl(id, enabled) {
  controls = { ...controls, [id]: enabled };
  emit();
}

export function toggleControl(id) {
  if (!(id in controls)) return getControls();
  controls = { ...controls, [id]: !controls[id] };
  emit();
  return getControls();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function nextSimulationId() {
  simulationIdCounter += 1;
  return `SIM-${String(simulationIdCounter).padStart(6, "0")}`;
}

export function getSimulationHistory() {
  return [...history];
}

export function addToHistory(entry) {
  history = [entry, ...history].slice(0, 8);
  emit();
}

/**
 * Overall posture risk derived from enabled controls.
 * Base 83 minus the reduction of every enabled control → default 72 (HIGH).
 */
export function computeOverallRisk(controlState = controls) {
  const reductions = {
    mfa: 6,
    endpointProtection: 3,
    networkSegmentation: 2,
    leastPrivilege: 2,
    passwordPolicy: 1,
    vpnAuthentication: 3,
  };

  const base = 83;
  let reduction = 0;
  Object.keys(controlState).forEach((id) => {
    if (controlState[id]) reduction += reductions[id] ?? 0;
  });

  return Math.max(0, base - reduction);
}

/**
 * Blast radius (estate-wide) derived from enabled controls.
 * Default 58%.
 */
export function computeBlastRadius(controlState = controls) {
  const reductions = {
    mfa: 6,
    endpointProtection: 2,
    networkSegmentation: 3,
    leastPrivilege: 2,
    passwordPolicy: 1,
    vpnAuthentication: 3,
  };

  const base = 69;
  let reduction = 0;
  Object.keys(controlState).forEach((id) => {
    if (controlState[id]) reduction += reductions[id] ?? 0;
  });

  return Math.max(0, base - reduction);
}

/**
 * Critical assets currently protected (12 critical total, 3 exposed by default).
 */
export function computeProtectedCritical(controlState = controls) {
  const exposed = controlState.mfa ? 1 : 3;
  return 12 - exposed;
}
