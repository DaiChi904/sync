"use client";

import { createContext, useContext } from "react";
import type { ICircuitEmulationPageHandler } from "@/domain/model/handler/ICircuitEmulationPageHandler";

export const CircuitEmulationPageHandlerContext = createContext<ICircuitEmulationPageHandler | undefined>(undefined);

export const useCircuitEmulationPageHandlerContext = () => {
  const ctx = useContext(CircuitEmulationPageHandlerContext);
  if (ctx === undefined) {
    throw new Error(
      "useCircuitEmulationPageHandlerContext must be used within a CircuitEmulationPageHandlerContextProvider",
    );
  }
  return ctx;
};
