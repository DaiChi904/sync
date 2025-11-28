"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useCircuitViewPageController } from "@/Controller/circuitViewPageController";
import { CircuitViewPageControllerContext } from "@/contexts/CircuitViewPageControllerContext";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import CircuitViewPageLayout from "@/features/routes/circuit/circuitView/CircuitViewPageLayout";
import { CircuitDetailQueryService } from "@/infrastructure/queryService/circuitDetailQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
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
  const getCircuitDetailUsecase = useMemo(
    () => new GetCircuitDetailUsecase({ circuitDetailQueryService }),
    [circuitDetailQueryService],
  );
  const circuitParserUsecase = useMemo(() => new CircuitParserService(), []);
  const circuitViewPageController = useCircuitViewPageController({
    query,
    getCircuitDetailUsecase,
    circuitParserUsecase,
  });

  return (
    <CircuitViewPageControllerContext.Provider value={circuitViewPageController}>
      <CircuitViewPageLayout />
    </CircuitViewPageControllerContext.Provider>
  );
}
