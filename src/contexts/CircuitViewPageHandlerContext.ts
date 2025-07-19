"use client";

import { createContext, useContext } from "react";
import type { ICircuitViewPageHandler } from "@/domain/model/handler/ICircuitViewPageHandler";

export const CircuitViewPageHandlerContext = createContext<ICircuitViewPageHandler | undefined>(undefined);

export const useCircuitViewPageHandlerContext = () => {
  const ctx = useContext(CircuitViewPageHandlerContext);
  if (ctx === undefined) {
    throw new Error(
      "useCircuitOverviewQueryServiceContext must be used within a CircuitOverviewQueryServiceContextProvider",
    );
  }
  return ctx;
};
