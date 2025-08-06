"use client";

import { useCallback, useEffect, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import {
  type CircuitEditorPageError,
  circuitEditorPageError,
  type ICircuitEditorPageHandler,
} from "@/domain/model/handler/ICircuitEditorPageHandler";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { Waypoint } from "@/domain/model/valueObject/waypoint";
import { useObjectState } from "@/hooks/objectState";
import { Attempt } from "@/utils/attempt";

interface CircuitEditorPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  circuitParserUsecase: ICircuitParserService;
  circuitEditorUsecase: ICircuitEditorUsecase;
  circuitRepository: ICircuitRepository;
}

export const useCircuitEditorPageHandler = ({
  query,
  getCircuitDetailUsecase,
  circuitParserUsecase,
  circuitEditorUsecase,
}: CircuitEditorPageHandlerDependencies): ICircuitEditorPageHandler => {
  const [error, setError] = useObjectState<CircuitEditorPageError>(circuitEditorPageError);

  const [circuit, setCircuit] = useState<Circuit | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);

  const fetch = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          throw new Attempt.Abort("circuitEditorPageHandler.fetch", "Failed to get circuit detail.", {
            cause: circuitDetail.error,
          });
        }

        setCircuit(circuitDetail.value);
      },
      () => setError("failedToGetCircuitDetailError", true),
    );
  }, [query, getCircuitDetailUsecase, setError]);

  const updateCircuitGuiData = useCallback((): void => {
    Attempt.proceed(
      () => {
        if (!circuit) {
          throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitGuiData", "Circuit is not defined.", {
            tag: "noCircuit",
          });
        }

        const circuitGuiData = circuitParserUsecase.parseToGuiData(circuit.circuitData);
        if (!circuitGuiData.ok) {
          throw new Attempt.Abort(
            "circuitEditorPageHandler.updateCircuitGuiData",
            "Failed to parse circuit data to gui data.",
            {
              cause: circuitGuiData.error,
            },
          );
        }

        setGuiData(circuitGuiData.value);
      },
      () => {
        setError("failedToParseCircuitDataError", true);
      },
    );
  }, [setError, circuit, circuitParserUsecase]);

  const save = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        if (!circuit) {
          throw new Attempt.Abort("circuitEditorPageHandler.save", "Circuit is not defined.", { tag: "noCircuit" });
        }

        const res = await circuitEditorUsecase.save(circuit);
        if (!res.ok) {
          throw new Attempt.Abort("circuitEditorPageHandler.save", "Failed to save circuit.", {
            cause: res.error,
          });
        }
      },
      () => setError("failedToSaveCircuitError", true),
    );
  }, [circuit, circuitEditorUsecase, setError]);

  const addCircuitNode = useCallback(
    (newNode: {
      id: CircuitNodeId;
      type: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev) {
              throw new Attempt.Abort("circuitEditorPageHandler.addCircuitNode", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            }
            return Circuit.from({
              ...prev,
              circuitData: {
                ...prev.circuitData,
                nodes: [...prev.circuitData.nodes, newNode],
                edges: prev.circuitData.edges,
              },
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  const updateCircuitNode = useCallback(
    (newNode: {
      id: CircuitNodeId;
      type: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev) {
              throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitNode", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            }
            const updated = CircuitData.from({
              nodes: prev.circuitData.nodes.map((node) => (node.id === newNode.id ? newNode : node)),
              edges: prev.circuitData.edges,
            });
            return Circuit.from({
              ...prev,
              circuitData: updated,
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  const deleteCircuitNode = useCallback(
    (nodeId: CircuitNodeId): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev) {
              throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitNode", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            }
            const updated = CircuitData.from({
              nodes: prev.circuitData.nodes.filter((node) => node.id !== nodeId),
              edges: prev.circuitData.edges,
            });
            return Circuit.from({
              ...prev,
              circuitData: updated,
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  const addCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev) {
              throw new Attempt.Abort("circuitEditorPageHandler.addCircuitEdge", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            }
            return Circuit.from({
              ...prev,
              circuitData: {
                ...prev.circuitData,
                nodes: prev.circuitData.nodes,
                edges: [...prev.circuitData.edges, newEdge],
              },
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  const updateCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev)
              throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitEdge", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            const updated = CircuitData.from({
              nodes: prev.circuitData.nodes,
              edges: prev.circuitData.edges.map((edge) => (edge.id === newEdge.id ? newEdge : edge)),
            });
            return Circuit.from({
              ...prev,
              circuitData: updated,
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  const deleteCircuitEdge = useCallback(
    (edgeId: CircuitEdgeId): void => {
      Attempt.proceed(
        () => {
          setCircuit((prev) => {
            if (!prev)
              throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitEdge", "Circuit is not defined.", {
                tag: "noCircuit",
              });
            const updated = CircuitData.from({
              nodes: prev.circuitData.nodes,
              edges: prev.circuitData.edges.filter((edge) => edge.id !== edgeId),
            });
            return Circuit.from({
              ...prev,
              circuitData: updated,
            });
          });
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [setError],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!circuit) return;

    updateCircuitGuiData();
  }, [updateCircuitGuiData, circuit]);

  return {
    error,
    circuit,
    guiData,
    save,
    addCircuitNode,
    updateCircuitNode,
    deleteCircuitNode,
    addCircuitEdge,
    updateCircuitEdge,
    deleteCircuitEdge,
  };
};
