"use client";

import { createContext, useContext } from "react";
import type { ISeedPageController } from "@/domain/model/controller/ISeedPageController";
import { ContextError } from "./contextError";

export const SeedPageControllerContext = createContext<ISeedPageController | undefined>(undefined);

export const useSeedPageControllerContext = () => {
  const ctx = useContext(SeedPageControllerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError("useSeedPageControllerContext must be used within a SeedPageControllerContextProvider.");
  }
  return ctx;
};
