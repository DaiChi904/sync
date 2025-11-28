"use client";

import { createContext, useContext } from "react";
import type { ICircuitViewPageController } from "@/domain/model/controller/ICircuitViewPageController";
import { ContextError } from "./contextError";

export const CircuitViewPageControllerContext = createContext<ICircuitViewPageController | undefined>(undefined);

export const useCircuitViewPageControllerContext = () => {
  const ctx = useContext(CircuitViewPageControllerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitViewPageControllerContext must be used within a CircuitViewPageControllerContextProvider",
    );
  }
  return ctx;
};
