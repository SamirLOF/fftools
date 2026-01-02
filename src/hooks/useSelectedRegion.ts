import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ff_selected_region";

export const useSelectedRegion = (defaultRegion: string = "SG") => {
  const [region, setRegionState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || defaultRegion;
    } catch {
      return defaultRegion;
    }
  });

  const setRegion = useCallback((nextRegion: string) => {
    setRegionState(nextRegion);
    try {
      localStorage.setItem(STORAGE_KEY, nextRegion);
    } catch {
      // ignore write errors (e.g. storage blocked)
    }
  }, []);

  // Keep storage in sync if default changes or storage is cleared.
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, region);
      }
    } catch {
      // ignore
    }
  }, [region]);

  return [region, setRegion] as const;
};
