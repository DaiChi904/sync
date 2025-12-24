"use client";

import { useMemo } from "react";
import { HomePageControllerContext } from "@/contexts/HomePageControllerContext";
import { useHomePageController } from "@/controller/homePageController";
import HomePageLayout from "@/features/routes/home/HomePageLayout";
import { CircuitOverviewsQueryService } from "@/infrastructure/queryService/circuitOverviewsQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { AddCircuitUsecase } from "@/usecase/addCircuitUsecase";
import { GetCircuitOverviewsUsecase } from "@/usecase/getCircuitOverviewsUsecase";

export default function Home() {
  const localStorage = useMemo(() => new LocalStorage("circuit"), []);
  const circuitRepository = useMemo(() => new CircuitRepository({ localStorage }), [localStorage]);
  const circuitOverviewsQueryService = useMemo(
    () => new CircuitOverviewsQueryService({ localStorage }),
    [localStorage],
  );
  const getCircuitOverviewsUsecase = useMemo(
    () => new GetCircuitOverviewsUsecase({ circuitOverviewsQueryService }),
    [circuitOverviewsQueryService],
  );
  const addCircuitUsecase = useMemo(() => new AddCircuitUsecase({ circuitRepository }), [circuitRepository]);
  const homePageController = useHomePageController({ getCircuitOverviewsUsecase, addCircuitUsecase });

  return (
    <HomePageControllerContext.Provider value={homePageController}>
      <HomePageLayout />
    </HomePageControllerContext.Provider>
  );
}
