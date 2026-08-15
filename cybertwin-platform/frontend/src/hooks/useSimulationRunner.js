import { useCallback, useEffect, useRef, useState } from "react";

import { SIMULATION_STEPS } from "../utils/mockData";
import { runSimulation, runCounterfactual } from "../services/simulationService";

const STEP_DURATION = 520;

/**
 * Drives the simulation progress animation and the underlying service call.
 * phase: idle → running → done
 */
export function useSimulationRunner() {
  const [phase, setPhase] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const runIdRef = useRef(0);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const run = useCallback(
    async (config, mode = "simulate") => {
      const runId = ++runIdRef.current;
      clearTimer();
      setError(null);

      setPhase("running");
      setActiveStep(0);
      if (mode === "simulate") setResult(null);

      timerRef.current = setInterval(() => {
        setActiveStep((step) => {
          if (step < SIMULATION_STEPS.length - 1) return step + 1;
          clearTimer();
          return step;
        });
      }, STEP_DURATION);

      try {
        const response =
          mode === "simulate"
            ? await runSimulation(config)
            : await runCounterfactual(config);

        if (runId !== runIdRef.current) return null;

        clearTimer();
        setActiveStep(SIMULATION_STEPS.length - 1);

        if (mode === "simulate") {
          setResult(response);
          setPhase("done");
          setTimeout(() => {
            if (runId === runIdRef.current) setActiveStep(0);
          }, 900);
        }

        return response;
      } catch (runError) {
        if (runId !== runIdRef.current) return null;
        clearTimer();
        setError(runError);
        setPhase("idle");
        return null;
      }
    },
    [clearTimer],
  );

  /**
   * Restores a previously stored result (e.g. from simulation history).
   */
  const setResultFromStore = useCallback((entry) => {
    clearTimer();
    setError(null);
    setResult(entry);
    setPhase("done");
  }, [clearTimer]);

  return {
    phase,
    activeStep,
    result,
    error,
    run,
    running: phase === "running",
    setResult: setResultFromStore,
  };
}
