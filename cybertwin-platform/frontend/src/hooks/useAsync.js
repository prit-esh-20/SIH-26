import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async data loader and exposes loading / success / empty / error
 * states with a retry action.
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    let alive = true;

    Promise.resolve(loaderRef.current())
      .then((data) => {
        if (!alive) return;
        setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (!alive) return;
        setState({ status: "error", data: null, error });
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    setAttempt((n) => n + 1);
  }, []);

  return {
    ...state,
    loading: state.status === "loading",
    retry,
  };
}
