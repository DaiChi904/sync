"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CircuitEditorPageHandlerContext } from "@/contexts/CircuitEditorPageHandlerContext";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import CircuitEditorPageLayout from "@/features/routes/Circuit/CircuitEditor/CircuitEditorPageLayout";
import { useCircuitEditorPageHandler } from "@/handler/circuitEditorPageHandler";
import { CircuitDetailQueryService } from "@/infrastructure/queryService/circuitDetailQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { CircuitEditorUsecase } from "@/usecase/circuitEditorUsecase";
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
  const circuitParserService = useMemo(() => new CircuitParserService(), []);
  const getCircuitDetailUsecase = useMemo(
    () => new GetCircuitDetailUsecase({ circuitDetailQueryService }),
    [circuitDetailQueryService],
  );
  const circuitParserUsecase = useMemo(() => new CircuitParserService(), []);
  const circuitEditorUsecase = useMemo(
    () => new CircuitEditorUsecase({ circuitRepository, circuitParserService }),
    [circuitRepository, circuitParserService],
  );
  const circuitEditorHandler = useCircuitEditorPageHandler({
    query,
    getCircuitDetailUsecase,
    circuitParserUsecase,
    circuitEditorUsecase,
    circuitRepository,
  });

  return (
    <CircuitEditorPageHandlerContext.Provider value={circuitEditorHandler}>
      <CircuitEditorPageLayout />
    </CircuitEditorPageHandlerContext.Provider>
  );
}
