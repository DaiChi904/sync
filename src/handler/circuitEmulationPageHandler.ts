import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitEmulationPageError,
  circuitEmulationPageError,
  type ICircuitEmulationPageHandler,
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
import { useObjectState } from "@/hooks/objectState";
import { Attempt } from "@/utils/attempt";

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
  const [error, setError] = useObjectState<CircuitEmulationPageError>(circuitEmulationPageError);

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);
  const [availableNodeIds, setAvailableNodeIds] = useState<Array<CircuitNodeId> | undefined>(undefined);
  const [client, setClient] = useState<ICircuitEmulatorService | undefined>(undefined);

  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.from(0));
  const [entryInputs, setEntryInputs] = useState<InputRecord>(InputRecord.from({}));
  const [outputs, setOutputs] = useState<Record<CircuitNodeId, EvalResult>>({});

  const fetch = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          throw new Attempt.Abort("circuitEmulationPageHandler.fetch", "Failed to get circuit detail.", {
            cause: circuitDetail.error,
            tag: "getCircuitDetail",
          });
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
          throw new Attempt.Abort("circuitEmulationPageHandler.fetch", "Failed to parse circuit data to gui data.", {
            cause: circuitGuiData.error,
            tag: "genGuiData",
          });
        }

        setGuiData(circuitGuiData.value);

        const circuitGraphData = circuitParserUsecase.parseToGraphData(circuitDetail.value.circuitData);
        if (!circuitGraphData.ok) {
          throw new Attempt.Abort("circuitEmulationPageHandler.fetch", "Failed to parse circuit data to graph data.", {
            cause: circuitGraphData.error,
            tag: "genGraphData",
          });
        }

        const circuitEmulatorService = generateCircuitEmulatorServiceClientUsecase.generate(circuitGraphData.value);
        if (!circuitEmulatorService.ok) {
          throw new Attempt.Abort("circuitEmulationPageHandler.fetch", "Failed to generate circuit emulator service.", {
            cause: circuitEmulatorService.error,
            tag: "genEmulatorService",
          });
        }

        setAvailableNodeIds(circuitGraphData.value.map((node) => node.id));
        setClient(circuitEmulatorService.value);
      },
      (err: unknown) => {
        switch (true) {
          case Attempt.isAborted(err) && err.tag === "getCircuitDetail": {
            setError("failedToGetCircuitDetailError", true);
            setError("failedToGenGuiCircuitDataError", true);
            setError("failedToSetupEmulatorServiceError", true);
            break;
          }
          case Attempt.isAborted(err) && err.tag === "genGuiData": {
            setError("failedToGenGuiCircuitDataError", true);
            setError("failedToSetupEmulatorServiceError", true);
            break;
          }
          case Attempt.isAborted(err) && err.tag === "genEmulatorService":
          case Attempt.isAborted(err) && err.tag === "genGraphData": {
            setError("failedToSetupEmulatorServiceError", true);
            break;
          }
          default: {
            setError("failedToGetCircuitDetailError", true);
            setError("failedToGenGuiCircuitDataError", true);
            setError("failedToSetupEmulatorServiceError", true);
            break;
          }
        }
      },
    );
  }, [query, getCircuitDetailUsecase, circuitParserUsecase, generateCircuitEmulatorServiceClientUsecase, setError]);

  const setupCircuitEmulatorServiceClient = useCallback((): void => {
    Attempt.proceed(
      () => {
        if (!client) {
          throw new Attempt.Abort(
            "circuitEmulationPageHandler.setupCircuitEmulatorServiceClient",
            "EmulatorService is not defined.",
            { tag: "noClient" },
          );
        }

        const res = client.setup();
        if (!res.ok) {
          throw new Attempt.Abort(
            "circuitEmulationPageHandler.setupCircuitEmulatorServiceClient",
            "Failed to setup emulator service.",
            {
              cause: res.error,
              tag: "setupClient",
            },
          );
        }
      },
      () => {
        setError("failedToSetupEmulatorServiceError", true);
      },
    );
  }, [client, setError]);

  const registInputNodes = useCallback((): void => {
    // In available states, using guiData is suitable for efficient.
    Attempt.proceed(
      () => {
        if (!guiData) {
          throw new Attempt.Abort("circuitEmulationPageHandler.registInputNodes", "GuiData is not defined.", {
            tag: "noGuiData",
          });
        }

        const entryNodes = guiData.nodes.filter((node) => node.type === CircuitNodeType.from("ENTRY"));
        const inputRecord = InputRecord.from({});
        entryNodes.forEach((node) => {
          inputRecord[CircuitNodeInputId.from(node.id)] = EvalResult.from(false);
        });
        setEntryInputs(inputRecord);
      },
      () => {
        setError("failedToSetupEmulatorServiceError", true);
      },
    );
  }, [guiData, setError]);

  const registOutputs = useCallback((): void => {
    Attempt.proceed(
      () => {
        if (!client) {
          throw new Attempt.Abort("circuitEmulationPageHandler.registOutputs", "EmulatorService is not defined.", {
            tag: "noClient",
          });
        }
        if (!availableNodeIds) {
          throw new Attempt.Abort("circuitEmulationPageHandler.registOutputs", "AvailableNodeIds is not defined.", {
            tag: "noAvailableNodeIds",
          });
        }

        const outputRecord: Record<CircuitNodeId, EvalResult> = {};
        availableNodeIds.forEach((nodeId) => {
          const res = client.getInfomationById(nodeId);
          if (!res.ok) {
            throw new Attempt.Abort("circuitEmulationPageHandler.registOutputs", "Failed to get information by id.", {
              cause: res.error,
              tag: "generatingOutputRecord",
            });
          }

          const source = res.value.history.get(currentPhase)?.entries();
          if (!source) {
            throw new Attempt.Abort(
              "circuitEmulationPageHandler.registOutputs",
              "No history found for the current phase",
              {
                tag: "generatingOutputRecord",
              },
            );
          }
          const output = Array.from(source).at(-1);
          if (!output) {
            throw new Attempt.Abort(
              "circuitEmulationPageHandler.registOutputs",
              "No output found for the current phase",
              {
                tag: "generatingOutputRecord",
              },
            );
          }

          outputRecord[nodeId] = EvalResult.from(output[1]);
        });

        setOutputs(outputRecord);
      },
      () => {
        setError("failedToEvalCircuitError", true);
      },
    );
  }, [client, availableNodeIds, currentPhase, setError]);

  const updateEntryInputs = useCallback((nodeId: CircuitNodeId, value: EvalResult): void => {
    setEntryInputs((prev) => ({
      ...prev,
      [nodeId]: value,
    }));
  }, []);

  const evalCircuit = useCallback((): void => {
    Attempt.proceed(
      () => {
        if (!client)
          throw new Attempt.Abort("circuitEmulationPageHandler.updateEntryInputs", "EmulatorService is not defined.", {
            tag: "noClient",
          });

        setCurrentPhase((prev) => Phase.from(prev + 1));

        const res = client.eval(entryInputs, currentPhase);
        if (!res.ok) {
          throw new Attempt.Abort("circuitEmulationPageHandler.updateEntryInputs", "Failed to eval circuit.", {
            cause: res.error,
            tag: "evalCircuit",
          });
        }

        registOutputs();
      },
      () => {
        setError("failedToEvalCircuitError", true);
      },
    );
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
