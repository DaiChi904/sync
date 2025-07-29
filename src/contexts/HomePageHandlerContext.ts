"use client";

import { createContext, useContext } from "react";
import type { IHomePageHandler } from "@/domain/model/handler/IHomePageHandler";

export const HomePageHandlerContext = createContext<IHomePageHandler | undefined>(undefined);

export const useHomePageHandlerContext = () => {
  const ctx = useContext(HomePageHandlerContext);
  if (ctx === undefined) {
    throw new Error("useHomePageHandlerContext must be used within a HomePageHandlerContext");
  }
  return ctx;
};
