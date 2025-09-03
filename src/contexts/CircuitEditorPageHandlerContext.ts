"use client";

import { createContext, useContext } from "react";
import type { ICircuitEditorPageHandler } from "@/domain/model/handler/ICircuitEditorPageHandler";
import { ContextError } from "./contextError";

export const CircuitEditorPageHandlerContext = createContext<ICircuitEditorPageHandler | undefined>(undefined);

export const useCircuitEditorPageHandlerContext = () => {
  const ctx = useContext(CircuitEditorPageHandlerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitEditorPageHandlerContext must be used within a CircuitEditorPageHandlerContextProvider",
    );
  }
  return ctx;
};
