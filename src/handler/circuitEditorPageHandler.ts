"use client";

import { useCallback, useEffect, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import {
  type CircuitEditorPageError,
  circuitEditorPageError,
  type ICircuitEditorPageHandler,
} from "@/domain/model/handler/ICircuitEditorPageHandler";
import { handleValidationError } from "@/domain/model/modelValidationError";
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

  const fetch = useCallback((): void => {
    handleValidationError(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          console.error(circuitDetail.error);
          setError("failedToGetCircuitDetailError", true);
          return;
        }

        setCircuit(circuitDetail.value);
      },
      () => setError("failedToGetCircuitDetailError", true),
    );
  }, [query, getCircuitDetailUsecase, setError]);

  const save = useCallback((): void => {
    handleValidationError(
      async () => {
        if (circuit === undefined) return;

        const res = await circuitEditorUsecase.save(circuit);
        if (!res.ok) {
          console.error(res.error);
          setError("failedToSaveCircuitError", true);
          return;
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
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
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
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
  );

  const deleteCircuitNode = useCallback(
    (nodeId: CircuitNodeId): void => {
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
  );

  const addCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
  );

  const updateCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
  );

  const deleteCircuitEdge = useCallback(
    (edgeId: CircuitEdgeId): void => {
      handleValidationError(
        () => {
          if (!circuit) return;

          setCircuit((prev) => {
            if (!prev) return prev;
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
    [circuit, setError],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    handleValidationError(
      () => {
        if (circuit === undefined) return;

        const circuitGuiData = circuitParserUsecase.parseToGuiData(circuit.circuitData);
        if (!circuitGuiData.ok) {
          console.error(circuitGuiData.error);
          setError("failedToParseCircuitDataError", true);
          return;
        }

        setGuiData(circuitGuiData.value);
      },
      () => setError("failedToGetCircuitDetailError", true),
    );
  }, [circuit, circuitParserUsecase, setError]);

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
