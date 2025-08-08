"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
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
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { Waypoint } from "@/domain/model/valueObject/waypoint";
import { useObjectState } from "@/hooks/objectState";
import { Attempt } from "@/utils/attempt";
import type { Result } from "@/utils/result";

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

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [focusedElement, setFocusedElement] = useState<CircuitGuiNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<CircuitGuiNode | null>(null);

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

  const getSvgCoords = useCallback((ev: React.MouseEvent): Result<Coordinate> => {
    return Attempt.proceed(
      () => {
        const svg = svgRef.current;
        if (!svg) {
          throw new Attempt.Abort("circuitEditorPageHandler.getSvgCoords", "svgRef is null.");
        }

        const pt = svg.createSVGPoint();
        pt.x = ev.clientX;
        pt.y = ev.clientY;
        const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        return { ok: true, value: Coordinate.from({ x: cursorPt.x, y: cursorPt.y }) } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }, []);

  const focusElement = useCallback((node: CircuitGuiNode) => {
    setFocusedElement(node);
  }, []);

  const handleNodeMouseDown = useCallback(
    (ev: React.MouseEvent, node: CircuitGuiNode) => {
      const svgCoordinate = getSvgCoords(ev);
      if (!svgCoordinate.ok) return;

      const { x: initialMouseX, y: initialMouseY } = svgCoordinate.value;

      setDraggingNode({
        ...node,
        coordinate: Coordinate.from({ x: initialMouseX - node.coordinate.x, y: initialMouseY - node.coordinate.y }),
      });
    },
    [getSvgCoords],
  );

  const handleNodeMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      if (!draggingNode) return;

      const svgCoordinate = getSvgCoords(ev);
      if (!svgCoordinate.ok) return;

      const { x, y } = svgCoordinate.value;
      const newX = x - draggingNode.coordinate.x;
      const newY = y - draggingNode.coordinate.y;

      const node = circuit?.circuitData.nodes.find((n) => n.id === draggingNode.id);
      if (node) {
        updateCircuitNode({
          ...node,
          coordinate: Coordinate.from({ x: newX, y: newY }),
        });
      }
    },
    [draggingNode, getSvgCoords, circuit, updateCircuitNode],
  );

  const handleNodeMouseUp = useCallback(() => setDraggingNode(null), []);

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
    svgRef,
    focusedElement,
    focusElement,
    draggingNode,
    handleNodeMouseDown,
    handleNodeMouseMove,
    handleNodeMouseUp,
  };
};
