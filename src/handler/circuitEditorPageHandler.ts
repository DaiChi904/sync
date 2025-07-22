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
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
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
  circuitRepository,
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
  }, [query, getCircuitDetailUsecase, circuitParserUsecase, circuit, setError]);

  const save = useCallback((): void => {
    handleValidationError(
      async () => {
        if (circuit === undefined) return;

        const res = await circuitRepository.save("UPDATE", circuit);
        if (!res.ok) {
          console.error(res.error);
          setError("failedToSaveCircuitError", true);
          return;
        }
      },
      () => setError("failedToSaveCircuitError", true),
    );
  }, [circuit, circuitRepository, setError]);

  const addCircuitNode = useCallback(
    (newNode: {
      type: "Node";
      nodeId: CircuitNodeId;
      nodeType: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "ADD",
            payload: newNode,
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  const updateCircuitNode = useCallback(
    (newNode: {
      type: "Node";
      nodeId: CircuitNodeId;
      nodeType: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "UPDATE",
            payload: newNode,
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  const deleteCircuitNode = useCallback(
    (nodeId: CircuitNodeId) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "DELETE",
            payload: { type: "Node", id: nodeId },
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  const addCircuitEdge = useCallback(
    (newEdge: {
      type: "Edge";
      edgeId: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Coordinate[];
    }) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "ADD",
            payload: newEdge,
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  const updateCircuitEdge = useCallback(
    (newEdge: {
      type: "Edge";
      edgeId: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Coordinate[];
    }) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "UPDATE",
            payload: newEdge,
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  const deleteCircuitEdge = useCallback(
    (nodeId: CircuitEdgeId) => {
      handleValidationError(
        () => {
          if (!circuit) return;

          const res = circuitEditorUsecase.generateNewCircuitData(circuit.circuitData, {
            method: "DELETE",
            payload: { type: "Edge", id: nodeId },
          });
          if (!res.ok) {
            console.error(res.error);
            setError("failedToUpdateCircuitDataError", true);
            return;
          }

          setCircuit(Circuit.from({ ...circuit, circuitData: res.value }));
        },
        () => {
          setError("failedToUpdateCircuitDataError", true);
        },
      );
    },
    [circuit, circuitEditorUsecase, setError],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

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
