"use client";

import { createContext, useContext } from "react";
import type { IHomePageHandler } from "@/domain/model/handler/IHomePageHandler";
import { ContextError } from "./contextError";

export const HomePageHandlerContext = createContext<IHomePageHandler | undefined>(undefined);

export const useHomePageHandlerContext = () => {
  const ctx = useContext(HomePageHandlerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useHomePageHandlerContext must be used within a CircuitOverviewQueryServiceContextProvider",
    );
  }
  return ctx;
};
