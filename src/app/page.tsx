"use client";

import { useMemo } from "react";
import { HomePageHandlerContext } from "@/contexts/HomePageHandlerContext";
import HomePageLayout from "@/features/Home/HomePageLayout";
import { HomePageHandler } from "@/handler/homePageHandler";
import { CircuitOverviewsQueryService } from "@/infrastructure/queryService/circuitOverviewsQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { GetCircuitOverviewsUsecase } from "@/usecase/getCircuitOverviewsUsecase";

export default function Home() {
  const localStorage = useMemo(() => new LocalStorage("circuit"), []);
  const circuitRepository = useMemo(() => new CircuitRepository({ localStorage }), [localStorage]);
  const circuitOverviewsQueryService = useMemo(
    () => new CircuitOverviewsQueryService({ circuitRepository }),
    [circuitRepository],
  );
  const getCircuitOverviewsUsecase = useMemo(
    () => new GetCircuitOverviewsUsecase({ circuitOverviewsQueryService }),
    [circuitOverviewsQueryService],
  );
  const homePageHandler = HomePageHandler({ getCircuitOverviewsUsecase });

  return (
    <HomePageHandlerContext.Provider value={homePageHandler}>
      <HomePageLayout />
    </HomePageHandlerContext.Provider>
  );
}
