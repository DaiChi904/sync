"use client";

import { useMemo } from "react";
import { HomePageHandlerContext } from "@/contexts/HomePageHandlerContext";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import HomePageLayout from "@/features/routes/Home/HomePageLayout";
import { useHomePageHandler } from "@/handler/homePageHandler";
import { CircuitOverviewsQueryService } from "@/infrastructure/queryService/circuitOverviewsQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { CircuitEditorUsecase } from "@/usecase/circuitEditorUsecase";
import { GetCircuitOverviewsUsecase } from "@/usecase/getCircuitOverviewsUsecase";

export default function Home() {
  const localStorage = useMemo(() => new LocalStorage("circuit"), []);
  const circuitRepository = useMemo(() => new CircuitRepository({ localStorage }), [localStorage]);
  const circuitOverviewsQueryService = useMemo(
    () => new CircuitOverviewsQueryService({ circuitRepository }),
    [circuitRepository],
  );
  const circuitParserService = useMemo(() => new CircuitParserService(), []);
  const getCircuitOverviewsUsecase = useMemo(
    () => new GetCircuitOverviewsUsecase({ circuitOverviewsQueryService }),
    [circuitOverviewsQueryService],
  );
  const circuitEditorUsecase = useMemo(
    () => new CircuitEditorUsecase({ circuitRepository, circuitParserService }),
    [circuitRepository, circuitParserService],
  );
  const homePageHandler = useHomePageHandler({ getCircuitOverviewsUsecase, circuitEditorUsecase });

  return (
    <HomePageHandlerContext.Provider value={homePageHandler}>
      <HomePageLayout />
    </HomePageHandlerContext.Provider>
  );
}
