import { useEffect, useState } from "react";

import { subscribe, getControls } from "../utils/twinStore";

/**
 * Subscribes to the twin store (security control states, simulation history).
 * Re-renders the component whenever the store changes.
 *
 * Returns the current controls and a monotonically increasing version
 * counter that changes on every store update.
 */
export function useTwin() {
  const [controls, setControls] = useState(getControls);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setControls(getControls());
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  return { controls, version };
}
