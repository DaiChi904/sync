"use client";

import { createContext, useContext } from "react";
import type { ICircuitViewPageHandler } from "@/domain/model/handler/ICircuitViewPageHandler";
import { ContextError } from "./contextError";

export const CircuitViewPageHandlerContext = createContext<ICircuitViewPageHandler | undefined>(undefined);

export const useCircuitViewPageHandlerContext = () => {
  const ctx = useContext(CircuitViewPageHandlerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitViewPageHandlerContext must be used within a CircuitViewPageHandlerContextProvider",
    );
  }
  return ctx;
};
