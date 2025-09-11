"use client";

import { createContext, useContext } from "react";
import type { ICircuitEmulationPageHandler } from "@/domain/model/handler/ICircuitEmulationPageHandler";
import { ContextError } from "./contextError";

export const CircuitEmulationPageHandlerContext = createContext<ICircuitEmulationPageHandler | undefined>(undefined);

export const useCircuitEmulationPageHandlerContext = () => {
  const ctx = useContext(CircuitEmulationPageHandlerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitEmulationPageHandlerContext must be used within a CircuitEmulationPageHandlerContextProvider",
    );
  }
  return ctx;
};
