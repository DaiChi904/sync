"use client";

import { createContext, useContext } from "react";
import type { ICircuitViewPageHandler } from "@/domain/model/handler/ICircuitViewPageHandler";

export const CircuitViewPageHandlerContext = createContext<ICircuitViewPageHandler | undefined>(undefined);

export const useCircuitViewPageHandlerContext = () => {
  const ctx = useContext(CircuitViewPageHandlerContext);
  if (ctx === undefined) {
    throw new Error("useCircuitViewPageHandlerContext must be used within a CircuitViewPageHandlerContextProvider");
  }
  return ctx;
};
