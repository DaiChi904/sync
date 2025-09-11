import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitEmulationPageErrorModel,
  CircuitEmulationPageHandlerError,
  type ICircuitEmulationPageHandler,
  initialCircuitEmulationPageError,
} from "@/domain/model/handler/ICircuitEmulationPageHandler";
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
import type { CircuitParserService } from "@/domain/service/circuitParserService";
import { usePartialState } from "@/hooks/partialState";

interface CircuitEmulationPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  generateCircuitEmulatorServiceClientUsecase: IGenerateCircuitEmulatorServiceClientUsecase;
  circuitParserUsecase: CircuitParserService;
}

export const useCircuitEmulationPageHandler = ({
  query,
  getCircuitDetailUsecase,
  generateCircuitEmulatorServiceClientUsecase,
  circuitParserUsecase,
}: CircuitEmulationPageHandlerDependencies): ICircuitEmulationPageHandler => {
  const [error, setError] = usePartialState<CircuitEmulationPageErrorModel>(initialCircuitEmulationPageError);
  const [uiState, setUiState] = usePartialState<ICircuitEmulationPageHandler["uiState"]>({
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "evalMenu" },
  });

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);
  const [availableNodeIds, setAvailableNodeIds] = useState<Array<CircuitNodeId> | undefined>(undefined);
  const [client, setClient] = useState<ICircuitEmulatorService | undefined>(undefined);

  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.from(0));
  const [entryInputs, setEntryInputs] = useState<InputRecord>(InputRecord.from({}));
  const [outputs, setOutputs] = useState<Record<CircuitNodeId, EvalResult>>({});

  const fetch = useCallback(async (): Promise<void> => {
    const circuitDetail = await getCircuitDetailUsecase.getById(query);
    if (!circuitDetail.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to get circuit detail.", {
        cause: circuitDetail.error,
      });
      console.error(err);

      setError("failedToGetCircuitDetailError", true);
      setError("failedToGenGuiCircuitDataError", true);
      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    setOverview(
      CircuitOverview.from({
        id: circuitDetail.value.id,
        title: circuitDetail.value.title,
        description: circuitDetail.value.description,
        createdAt: circuitDetail.value.createdAt,
        updatedAt: circuitDetail.value.updatedAt,
      }),
    );

    const circuitGuiData = circuitParserUsecase.parseToGuiData(circuitDetail.value.circuitData);
    if (!circuitGuiData.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to parse circuit data to gui data.", {
        cause: circuitGuiData.error,
      });
      console.error(err);

      setError("failedToGenGuiCircuitDataError", true);
      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    setGuiData(circuitGuiData.value);

    const circuitGraphData = circuitParserUsecase.parseToGraphData(circuitDetail.value.circuitData);
    if (!circuitGraphData.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to parse circuit data to graph data.", {
        cause: circuitGraphData.error,
      });
      console.error(err);

      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    const circuitEmulatorService = generateCircuitEmulatorServiceClientUsecase.generate(circuitGraphData.value);
    if (!circuitEmulatorService.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to generate circuit emulator service.", {
        cause: circuitEmulatorService.error,
      });
      console.error(err);

      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    setAvailableNodeIds(circuitGraphData.value.map((node) => node.id));
    setClient(circuitEmulatorService.value);
  }, [query, getCircuitDetailUsecase, circuitParserUsecase, generateCircuitEmulatorServiceClientUsecase, setError]);

  const setupCircuitEmulatorServiceClient = useCallback((): void => {
    if (!client) {
      const err = new CircuitEmulationPageHandlerError(
        "Failed to setup emulator service. EmulatorService is not defined.",
      );
      console.error(err);

      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    const res = client.setup();
    if (!res.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to setup emulator service.", {
        cause: res.error,
      });
      console.error(err);

      setError("failedToSetupEmulatorServiceError", true);
      return;
    }
  }, [client, setError]);

  const registInputNodes = useCallback((): void => {
    // In available states, using guiData is suitable for efficient.
    if (!guiData) {
      const err = new CircuitEmulationPageHandlerError("Failed to regist input nodes. GuiData is not defined.");
      console.error(err);

      setError("failedToSetupEmulatorServiceError", true);
      return;
    }

    const entryNodes = guiData.nodes.filter((node) => node.type === CircuitNodeType.from("ENTRY"));
    const inputRecord = InputRecord.from({});

    entryNodes.forEach((node) => {
      inputRecord[CircuitNodeInputId.from(node.id)] = EvalResult.from(false);
    });

    setEntryInputs(inputRecord);
  }, [guiData, setError]);

  const registOutputs = useCallback((): void => {
    try {
      if (!client) {
        throw new CircuitEmulationPageHandlerError("Failed to regist outputs. EmulatorService is not defined.");
      }
      if (!availableNodeIds) {
        throw new CircuitEmulationPageHandlerError("Failed to regist outputs. AvailableNodeIds is not defined.");
      }

      const outputRecord: Record<CircuitNodeId, EvalResult> = {};
      availableNodeIds.forEach((nodeId) => {
        const res = client.getInfomationById(nodeId);
        if (!res.ok) {
          throw new CircuitEmulationPageHandlerError(
            `Failed to regist outputs. Couldn't to get information. id: ${nodeId}`,
            {
              cause: res.error,
            },
          );
        }

        const source = res.value.history.get(currentPhase)?.entries();
        if (!source) {
          throw new CircuitEmulationPageHandlerError(
            "Failed to regist outputs. No history found for the current phase",
          );
        }
        const output = Array.from(source).at(-1);
        if (!output) {
          throw new CircuitEmulationPageHandlerError("Failed to regist outputs. No output found for the current phase");
        }

        outputRecord[nodeId] = EvalResult.from(output[1]);
      });

      setOutputs(outputRecord);
    } catch (err: unknown) {
      console.error(err);
      setError("failedToEvalCircuitError", true);
    }
  }, [client, availableNodeIds, currentPhase, setError]);

  const updateEntryInputs = useCallback((nodeId: CircuitNodeId, value: EvalResult): void => {
    setEntryInputs((prev) => ({
      ...prev,
      [nodeId]: value,
    }));
  }, []);

  const evalCircuit = useCallback((): void => {
    if (!client) {
      const err = new CircuitEmulationPageHandlerError("Failed to eval circuit. EmulatorService is not defined.");
      console.error(err);

      setError("failedToEvalCircuitError", true);
      return;
    }

    setCurrentPhase((prev) => Phase.from(prev + 1));

    const res = client.eval(entryInputs, currentPhase);
    if (!res.ok) {
      const err = new CircuitEmulationPageHandlerError("Failed to eval circuit. EmulatorService is not defined.", {
        cause: res.error,
      });
      console.error(err);

      setError("failedToEvalCircuitError", true);
      return;
    }

    registOutputs();
  }, [client, registOutputs, setError, entryInputs, currentPhase]);

  const openToolBarMenu = useCallback(
    (kind: "file" | "view" | "goTo" | "help") => {
      setUiState("toolBarMenu", { open: kind });
    },
    [setUiState],
  );

  const closeToolBarMenu = useCallback(() => {
    setUiState("toolBarMenu", { open: "none" });
  }, [setUiState]);

  const changeActivityBarMenu = useCallback(
    (kind: "evalMenu") => {
      setUiState("activityBarMenu", { open: kind });
    },
    [setUiState],
  );

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
    uiState,
    overview,
    guiData,
    currentPhase,
    entryInputs,
    outputs,
    updateEntryInputs,
    evalCircuit,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  };
};
