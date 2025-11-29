"use client";

import { useMemo } from "react";
import { SeedPageControllerContext } from "@/contexts/SeedPageControllerContext";
import { useSeedPageController } from "@/controller/seedPageController";
import SeedPageLayout from "@/features/routes/dev/seed/SeedPageLayout";
import { CircuitOverviewsQueryService } from "@/infrastructure/queryService/circuitOverviewsQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { AddCircuitUsecase } from "@/usecase/addCircuitUsecase";
import { DeleteCircuitUsecase } from "@/usecase/deleteCircuitUsecase";
import { GetCircuitOverviewsUsecase } from "@/usecase/getCircuitOverviewsUsecase";

export default function SeedPage() {
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
  const deleteCircuitUsecase = useMemo(() => new DeleteCircuitUsecase({ circuitRepository }), [circuitRepository]);
  const seedPageController = useSeedPageController({
    getCircuitOverviewsUsecase,
    addCircuitUsecase,
    deleteCircuitUsecase,
  });

  return (
    <SeedPageControllerContext.Provider value={seedPageController}>
      <SeedPageLayout />
    </SeedPageControllerContext.Provider>
  );
}
