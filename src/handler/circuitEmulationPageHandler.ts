import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitEmulationPageError,
  circuitEmulationPageError,
  type ICircuitEmulationPageHandler,
} from "@/domain/model/handler/ICircuitEmulationPageHandler";
import { handleValidationError } from "@/domain/model/modelValidationError";
import type { ICircuitEmulatorService } from "@/domain/model/service/ICircuitEmulatorService";
import type { IGenerateCircuitEmulatorServiceClientUsecase } from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { Phase } from "@/domain/model/valueObject/phase";
import { useObjectState } from "@/hooks/objectState";

interface CircuitEmulationPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  generateCircuitEmulatorServiceClientUsecase: IGenerateCircuitEmulatorServiceClientUsecase;
}

export const useCircuitEmulationPageHandler = ({
  query,
  getCircuitDetailUsecase,
  generateCircuitEmulatorServiceClientUsecase,
}: CircuitEmulationPageHandlerDependencies): ICircuitEmulationPageHandler => {
  const [error, setError] = useObjectState<CircuitEmulationPageError>(circuitEmulationPageError);

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);
  const [availableNodeIds, setAvailableNodeIds] = useState<Array<CircuitNodeId> | undefined>(undefined);
  const [client, setClient] = useState<ICircuitEmulatorService | undefined>(undefined);

  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.from(0));
  const [entryInputs, setEntryInputs] = useState<InputRecord>(InputRecord.from({}));
  const [outputs, setOutputs] = useState<Record<CircuitNodeId, EvalResult>>({});

  const fetch = useCallback((): void => {
    handleValidationError(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          console.error(circuitDetail.error);
          setError("failedToGetCircuitDetailError", true);
          setError("failedToGenerateEmulatorServiceError", true);
          return;
        }

        const circuitEmulatorService = generateCircuitEmulatorServiceClientUsecase.generate(
          circuitDetail.value.graphData,
        );
        if (!circuitEmulatorService.ok) {
          console.error(circuitEmulatorService.error);
          setError("failedToGenerateEmulatorServiceError", true);
          return;
        }

        setOverview(circuitDetail.value.circuitOverview);
        setGuiData(circuitDetail.value.guiData);
        setClient(circuitEmulatorService.value);
        setAvailableNodeIds(circuitDetail.value.graphData.map((node) => node.id));
      },
      () => {
        setError("failedToGetCircuitDetailError", true);
        setError("failedToGenerateEmulatorServiceError", true);
      },
    );
  }, [query, getCircuitDetailUsecase, generateCircuitEmulatorServiceClientUsecase, setError]);

  const setupCircuitEmulatorServiceClient = useCallback((): void => {
    if (!guiData || !client) return;

    const res = client.setup();
    if (!res.ok) {
      console.error(res.error);
      setError("failedToSetupError", true);
    }
  }, [guiData, client, setError]);

  const registInputNodes = useCallback((): void => {
    if (!guiData) return;

    const entryNodes = guiData.nodes.filter((node) => node.type === CircuitNodeType.from("ENTRY"));
    const inputRecord = InputRecord.from({});
    entryNodes.forEach((node) => {
      inputRecord[CircuitNodeInputId.from(node.id)] = EvalResult.from(false);
    });
    setEntryInputs(inputRecord);
  }, [guiData]);

  const registOutputs = useCallback((): void => {
    if (!client) return;

    const outputRecord: Record<CircuitNodeId, EvalResult> = {};
    availableNodeIds?.forEach((nodeId) => {
      const res = client.getInfomationById(nodeId);
      if (!res.ok) {
        console.error(res.error);
        setError("failedToEvalCircuitError", true);
        return;
      }

      const source = res.value.history.get(currentPhase)?.entries();
      if (!source) {
        console.error("No history found for the current phase");
        setError("failedToEvalCircuitError", true);
        return;
      }
      const output = Array.from(source).at(-1);
      if (!output) {
        console.error("No output found for the current phase");
        setError("failedToEvalCircuitError", true);
        return;
      }
      outputRecord[nodeId] = EvalResult.from(output[1]);
    });
    setOutputs(outputRecord);
  }, [client, availableNodeIds, currentPhase, setError]);

  const updateEntryInputs = useCallback((nodeId: CircuitNodeId, value: EvalResult): void => {
    setEntryInputs((prev) => ({
      ...prev,
      [nodeId]: value,
    }));
  }, []);

  const evalCircuit = useCallback((): void => {
    if (!client) return;

    setCurrentPhase((prev) => Phase.from(prev + 1));

    const res = client.eval(entryInputs, currentPhase);
    if (!res.ok) {
      console.error(res.error);
      setError("failedToEvalCircuitError", true);
    }

    registOutputs();
  }, [client, registOutputs, setError, entryInputs, currentPhase]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: With all dependencies, it causes unnecessary executions and induce cretical issue.
  useEffect(() => {
    if (client) {
      setupCircuitEmulatorServiceClient();
      registInputNodes();
      registOutputs();
    }
  }, [client]);

  return {
    error,
    overview,
    guiData,
    currentPhase,
    entryInputs,
    outputs,
    updateEntryInputs,
    evalCircuit,
  };
};
