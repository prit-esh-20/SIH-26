import { useCallback, useEffect, useRef, useState } from "react";

import { SIMULATION_STEPS } from "../utils/mockData";
import { runSimulation, runCounterfactual } from "../services/simulationService";

const STEP_DURATION = 520;
const STEP_RESET_DELAY = 900;

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
  const resetTimerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const resetTimers = useCallback(() => {
    clearTimer();
    clearResetTimer();
  }, [clearTimer, clearResetTimer]);

  useEffect(() => resetTimers, [resetTimers]);

  const run = useCallback(
    async (config, mode = "simulate") => {
      const runId = ++runIdRef.current;
      resetTimers();
      setError(null);

      setPhase("running");
      setActiveStep(0);
      if (mode === "simulate") setResult(null);

      let stepCount = 0;
      timerRef.current = setInterval(() => {
        stepCount += 1;
        if (stepCount >= SIMULATION_STEPS.length) {
          clearTimer();
        } else {
          setActiveStep(stepCount);
        }
      }, STEP_DURATION);

      let failed = false;
      try {
        const response =
          mode === "simulate"
            ? await runSimulation(config)
            : await runCounterfactual(config);

        if (runId !== runIdRef.current) return null;

        if (mode === "simulate") {
          setResult(response);
        }

        return response;
      } catch (runError) {
        if (runId !== runIdRef.current) return null;
        failed = true;
        setError(runError);
        return null;
      } finally {
        if (runId === runIdRef.current) {
          clearTimer();
          setPhase(failed ? "idle" : "done");
          if (!failed) {
            setActiveStep(SIMULATION_STEPS.length - 1);
            resetTimerRef.current = setTimeout(() => {
              if (runId === runIdRef.current) setActiveStep(0);
            }, STEP_RESET_DELAY);
          }
        }
      }
    },
    [clearTimer, resetTimers],
  );

  /**
   * Restores a previously stored result (e.g. from simulation history).
   */
  const setResultFromStore = useCallback((entry) => {
    resetTimers();
    setError(null);
    setResult(entry);
    setPhase("done");
  }, [resetTimers]);

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
