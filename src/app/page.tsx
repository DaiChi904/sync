"use client";

import { useMemo } from "react";
import { HomePageHandlerContext } from "@/contexts/HomePageHandlerContext";
import HomePageLayout from "@/features/routes/home/HomePageLayout";
import { useHomePageHandler } from "@/handler/homePageHandler";
import { CircuitOverviewsQueryService } from "@/infrastructure/queryService/circuitOverviewsQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { AddCircuitUsecase } from "@/usecase/addCircuitUsecase";
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
  const addCircuitUsecase = useMemo(() => new AddCircuitUsecase({ circuitRepository }), [circuitRepository]);
  const homePageHandler = useHomePageHandler({ getCircuitOverviewsUsecase, addCircuitUsecase });

  return (
    <HomePageHandlerContext.Provider value={homePageHandler}>
      <HomePageLayout />
    </HomePageHandlerContext.Provider>
  );
}
