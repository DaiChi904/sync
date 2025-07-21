"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CircuitEmulationPageHandlerContext } from "@/contexts/CircuitEmulationPageHandlerContext";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import CircuitEmulationPageLayout from "@/features/Circuit/CircuitEmulation/CircuitEmulationPageLayout";
import { useCircuitEmulationPageHandler } from "@/handler/circuitEmulationPageHandler";
import { CircuitDetailQueryService } from "@/infrastructure/queryService/circuitDetailQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { GenerateCircuitEmulatorServiceClientUsecase } from "@/usecase/generateCircuitEmulatorServiceClientUsecase";
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
  const getCircuitDetailUsecase = useMemo(
    () => new GetCircuitDetailUsecase({ circuitDetailQueryService }),
    [circuitDetailQueryService],
  );
  const generateCircuitEmulatorServiceClientUsecase = useMemo(
    () => new GenerateCircuitEmulatorServiceClientUsecase({ circuitEmulatorService }),
    [circuitEmulatorService],
  );
  const circuitParserUsecase = useMemo(() => new CircuitParserService(), []);
  const circuitEmulationPageHandler = useCircuitEmulationPageHandler({
    query,
    getCircuitDetailUsecase,
    generateCircuitEmulatorServiceClientUsecase,
    circuitParserUsecase,
  });

  return (
    <CircuitEmulationPageHandlerContext.Provider value={circuitEmulationPageHandler}>
      <CircuitEmulationPageLayout />
    </CircuitEmulationPageHandlerContext.Provider>
  );
}
