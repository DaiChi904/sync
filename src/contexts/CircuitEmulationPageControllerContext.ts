"use client";

import { createContext, useContext } from "react";
import type { ICircuitEmulationPageController } from "@/domain/model/controller/ICircuitEmulationPageController";
import { ContextError } from "./contextError";

export const CircuitEmulationPageControllerContext = createContext<ICircuitEmulationPageController | undefined>(
  undefined,
);

export const useCircuitEmulationPageControllerContext = () => {
  const ctx = useContext(CircuitEmulationPageControllerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitEmulationPageControllerContext must be used within a CircuitEmulationPageControllerContextProvider",
    );
  }
  return ctx;
};
