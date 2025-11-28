"use client";

import { createContext, useContext } from "react";
import type { IHomePageController } from "@/domain/model/controller/IHomePageController";
import { ContextError } from "./contextError";

export const HomePageControllerContext = createContext<IHomePageController | undefined>(undefined);

export const useHomePageControllerContext = () => {
  const ctx = useContext(HomePageControllerContext);
  if (ctx === undefined) {
    // eslint-disable-next-line custom-rules/throw-only-in-try
    throw new ContextError(
      "useHomePageControllerContext must be used within a CircuitOverviewQueryServiceContextProvider",
    );
  }
  return ctx;
};
