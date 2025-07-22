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
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
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

  const [circuitEditorData, setCircuitEditorData] = useState<
    | {
        node: Array<{
          type: "Node";
          nodeId: CircuitNodeId;
          nodeType: CircuitNodeType;
          inputs: CircuitNodePinId[];
          outputs: CircuitNodePinId[];
          coordinate: Coordinate;
          size: CircuitNodeSize;
        }>;
        edge: Array<{
          type: "Edge";
          edgeId: CircuitEdgeId;
          from: CircuitNodePinId;
          to: CircuitNodePinId;
          waypoints: Coordinate[];
        }>;
      }
    | undefined
  >(undefined);

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

  const genCircuitEditorData = useCallback(() => {
    if (circuit === undefined) return;

    const lines = circuit.circuitData
      .split(/;\s*/)
      .map((line) => line.trim())
      .filter(Boolean);
    const nodes: Array<{
      type: "Node";
      nodeId: CircuitNodeId;
      nodeType: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }> = [];
    const edges: Array<{
      type: "Edge";
      edgeId: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Coordinate[];
    }> = [];

    lines.forEach((line) => {
      if (line.startsWith("Node")) {
        const parts = line.split(/,\s*/);
        const nodeId = parts[1];
        const nodeType = parts[2];
        const inputs = parts[3]
          .replace(/[[\]]/g, "")
          .split(/\s*\|\s*|\s*,\s*/)
          .filter(Boolean);
        const outputs = parts[4]
          .replace(/[[\]]/g, "")
          .split(/\s*\|\s*|\s*,\s*/)
          .filter(Boolean);
        const coordinate = parts[5].replace(/[[\]]/g, "").split(":").map(Number) as [number, number];
        const size = parts[6].replace(/[[\]]/g, "").split(":").map(Number) as [number, number];

        nodes.push({
          type: "Node",
          nodeId: CircuitNodeId.from(nodeId),
          nodeType: CircuitNodeType.from(nodeType),
          inputs: inputs.map((input) => CircuitNodePinId.from(input)),
          outputs: outputs.map((output) => CircuitNodePinId.from(output)),
          coordinate: Coordinate.from({
            x: coordinate[0],
            y: coordinate[1],
          }),
          size: CircuitNodeSize.from({
            x: size[0],
            y: size[1],
          }),
        });
      } else if (line.startsWith("Edge")) {
        const parts = line.split(/,\s*/);
        const edgeId = parts[1];
        const from = parts[2].replace(/[[\]]/g, "").split("->")[0];
        const to = parts[2].replace(/[[\]]/g, "").split("->")[1];
        const rawWaypoints = parts[3]
          .replace("[", "")
          .replace("]", "")
          .trim()
          .split("|")
          .map((point) => point.trim());
        const waypoints =
          rawWaypoints[0] !== "NONE"
            ? rawWaypoints.map((raw) => {
                const rawCoordinate = raw.split(":");
                return Coordinate.from({ x: Number(rawCoordinate[0]), y: Number(rawCoordinate[1]) });
              })
            : [];

        edges.push({
          type: "Edge",
          edgeId: CircuitEdgeId.from(edgeId),
          from: CircuitNodePinId.from(from),
          to: CircuitNodePinId.from(to),
          waypoints: waypoints,
        });
      }
    });

    setCircuitEditorData({
      node: nodes,
      edge: edges,
    });
  }, [circuit?.circuitData.split, circuit]);

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

  useEffect(() => {
    genCircuitEditorData();
  }, [genCircuitEditorData]);

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
    circuitEditorData,
    save,
    addCircuitNode,
    updateCircuitNode,
    deleteCircuitNode,
    addCircuitEdge,
    updateCircuitEdge,
    deleteCircuitEdge,
  };
};
