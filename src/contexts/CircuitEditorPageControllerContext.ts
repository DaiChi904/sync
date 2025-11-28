"use client";

import { createContext, useContext } from "react";
import type { ICircuitEditorPageController } from "@/domain/model/controller/ICircuitEditorPageController";
import { ContextError } from "./contextError";

export const CircuitEditorPageControllerContext = createContext<ICircuitEditorPageController | undefined>(undefined);

export const useCircuitEditorPageControllerContext = () => {
  const ctx = useContext(CircuitEditorPageControllerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useCircuitEditorPageControllerContext must be used within a CircuitEditorPageControllerContextProvider",
    );
  }
  return ctx;
};
