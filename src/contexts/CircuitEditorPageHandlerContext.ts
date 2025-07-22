"use client";

import { createContext, useContext } from "react";
import type { ICircuitEditorPageHandler } from "@/domain/model/handler/ICircuitEditorPageHandler";

export const CircuitEditorPageHandlerContext = createContext<ICircuitEditorPageHandler | undefined>(undefined);

export const useCircuitEditorPageHandlerContext = () => {
  const ctx = useContext(CircuitEditorPageHandlerContext);
  if (ctx === undefined) {
    throw new Error("useCircuitEditorPageHandlerContext must be used within a CircuitEditorPageHandlerContextProvider");
  }
  return ctx;
};
