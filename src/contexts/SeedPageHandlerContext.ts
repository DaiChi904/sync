"use client";

import { createContext, useContext } from "react";
import type { ISeedPageHandler } from "@/domain/model/handler/ISeedPageHandler";
import { ContextError } from "./contextError";

export const SeedPageHandlerContext = createContext<ISeedPageHandler | undefined>(undefined);

export const useSeedPageHandlerContext = () => {
  const ctx = useContext(SeedPageHandlerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError("useSeedPageHandlerContext must be used within a SeedPageHandlerContextProvider.");
  }
  return ctx;
};
