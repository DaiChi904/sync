"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CircuitEmulationPageHandlerContext } from "@/contexts/CircuitEmulationPageHandlerContext";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import { EmulationOrganizer } from "@/domain/service/emulationOrganizer";
import { CircuitEmulatorService } from "@/domain/service/newCircuitEmulatorService";
import CircuitEmulationPageLayout from "@/features/routes/Circuit/CircuitEmulation/CircuitEmulationPageLayout";
import { useCircuitEmulationPageHandler } from "@/handler/circuitEmulationPageHandler";
import { CircuitDetailQueryService } from "@/infrastructure/queryService/circuitDetailQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { EmulationUsecase } from "@/usecase/emulationUsecase";
import { GetCircuitDetailUsecase } from "@/usecase/getCircuitDetailUsecase";

export default function CircuitView() {
  const params = useParams<{ id: CircuitId }>();
  const query = params.id;

  const localStorage = useMemo(() => new LocalStorage("circuit"), []);
  const circuitRepository = useMemo(() => new CircuitRepository({ localStorage }), [localStorage]);
  const circuitDetailQueryService = useMemo(
    () => new CircuitDetailQueryService({ circuitRepository }),
    [circuitRepository],
  );
  const circuitEmulatorService = useMemo(() => CircuitEmulatorService, []);
  const emulationOrganizer = useMemo(() => EmulationOrganizer, []);
  const getCircuitDetailUsecase = useMemo(
    () => new GetCircuitDetailUsecase({ circuitDetailQueryService }),
    [circuitDetailQueryService],
  );
  const createEmulationUsecase = useMemo(
    () => EmulationUsecase.from(circuitEmulatorService, emulationOrganizer),
    [circuitEmulatorService, emulationOrganizer],
  );
  const circuitParserUsecase = useMemo(() => new CircuitParserService(), []);
  const circuitEmulationPageHandler = useCircuitEmulationPageHandler({
    query,
    getCircuitDetailUsecase,
    createEmulationUsecase,
    circuitParserUsecase,
  });

  return (
    <CircuitEmulationPageHandlerContext.Provider value={circuitEmulationPageHandler}>
      <CircuitEmulationPageLayout />
    </CircuitEmulationPageHandlerContext.Provider>
  );
}
