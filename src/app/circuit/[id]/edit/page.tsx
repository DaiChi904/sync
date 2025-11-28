"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useCircuitEditorPageController } from "@/Controller/circuitEditorPageController";
import { CircuitEditorPageControllerContext } from "@/contexts/CircuitEditorPageControllerContext";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitParserService } from "@/domain/service/circuitParserService";
import CircuitEditorPageLayout from "@/features/routes/circuit/circuitEditor/CircuitEditorPageLayout";
import { CircuitDetailQueryService } from "@/infrastructure/queryService/circuitDetailQueryService";
import { CircuitRepository } from "@/infrastructure/repository/circuitRepository";
import { LocalStorage } from "@/infrastructure/storage/localStorage";
import { DeleteCircuitUsecase } from "@/usecase/deleteCircuitUsecase";
import { GetCircuitDetailUsecase } from "@/usecase/getCircuitDetailUsecase";
import { UpdateCircuitUsecase } from "@/usecase/updateCircuitUsecase";

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
  const updateCircuitUsecase = useMemo(() => new UpdateCircuitUsecase({ circuitRepository }), [circuitRepository]);
  const deleteCircuitUsecase = useMemo(() => new DeleteCircuitUsecase({ circuitRepository }), [circuitRepository]);
  const circuitEditorController = useCircuitEditorPageController({
    query,
    getCircuitDetailUsecase,
    circuitParserUsecase,
    updateCircuitUsecase,
    deleteCircuitUsecase,
    circuitRepository,
  });

  return (
    <CircuitEditorPageControllerContext.Provider value={circuitEditorController}>
      <CircuitEditorPageLayout />
    </CircuitEditorPageControllerContext.Provider>
  );
}
