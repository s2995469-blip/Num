"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query subscription (false on the server). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** A value computed only on the client (undefined during SSR/hydration). */
export function useClientValue<T>(get: () => T): T | undefined {
  return useSyncExternalStore(noopSubscribe, get, () => undefined);
}
