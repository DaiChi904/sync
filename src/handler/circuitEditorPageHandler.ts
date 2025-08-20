"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
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
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { Waypoint } from "@/domain/model/valueObject/waypoint";
import { usePartialState } from "@/hooks/partialState";
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
  const [error, setError] = usePartialState<CircuitEditorPageError>(circuitEditorPageError);
  const [uiState, setUiState] = usePartialState<ICircuitEditorPageHandler["uiState"]>({
    toolbarMenu: { open: "none" },
    diagramUtilityMenu: { open: "none", at: null },
  });

  const [circuit, setCircuit] = useState<Circuit | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);
  const [viewBox, setViewBox] = useState<{ x: number; y: number; w: number; h: number } | undefined>(undefined);

  const circuitDiagramContainer = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isPanningRef = useRef(false);
  const [lastMousePosition, setLastMousePosition] = useState<{ x: number; y: number } | null>(null);

  const [focusedElement, setFocusedElement] = useState<
    { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } } | null
  >(null);
  const [draggingNode, setDraggingNode] = useState<CircuitGuiNode | null>(null);
  const [draggingNodePin, setDraggingNodePin] = useState<{
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to";
    method: "ADD" | "UPDATE";
  } | null>(null);
  const [tempEdge, setTempEdge] = useState<{ from: Coordinate; to: Coordinate } | null>(null);
  const [draggingWaypoint, setDraggingWaypoint] = useState<{
    id: CircuitEdgeId;
    offset: Coordinate;
    index: number;
  } | null>(null);

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
          throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitGuiData", "Circuit is not defined.");
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

        //-- define INITIAL viewbox value --//
        if (viewBox) return;

        if (circuitGuiData.value.nodes.length === 0) {
          const viewWidth = circuitDiagramContainer.current?.clientWidth ?? 1000;
          const viewHeight = circuitDiagramContainer.current?.clientHeight ?? 1000;
          setViewBox({ x: -viewWidth / 2, y: -viewHeight / 2, w: viewWidth, h: viewHeight });
          return;
        }

        const MARRGIN = 20;
        const minX =
          Math.min(...circuitGuiData.value.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN;
        const minY =
          Math.min(...circuitGuiData.value.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN;
        const maxX =
          Math.max(...circuitGuiData.value.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN;
        const maxY =
          Math.max(...circuitGuiData.value.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN;
        const viewWidth = circuitDiagramContainer.current?.clientWidth ?? maxX - minX;
        const viewHeight = circuitDiagramContainer.current?.clientHeight ?? maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        setViewBox({ x: centerX - viewWidth / 2, y: centerY - viewHeight / 2, w: viewWidth, h: viewHeight });
        //-- define INITIAL viewbox value --//
      },
      () => {
        setError("failedToParseCircuitDataError", true);
      },
    );
  }, [circuit, circuitParserUsecase, viewBox, setError]);

  const handleMouseDown = (ev: React.MouseEvent) => {
    // On right click.
    if (ev.button !== 2) return;

    isPanningRef.current = true;
    setLastMousePosition({ x: ev.clientX, y: ev.clientY });
  };

  const handleMouseMove = (ev: React.MouseEvent) => {
    Attempt.proceed(
      () => {
        if (!isPanningRef.current || !lastMousePosition) return;

        if (!viewBox) return;

        const dx = (ev.clientX - lastMousePosition.x) * (viewBox.w / window.innerWidth);
        const dy = (ev.clientY - lastMousePosition.y) * (viewBox.h / window.innerHeight);

        setViewBox((prev) => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.handleMouseMove", "viewBox is not defined.");
          }
          return {
            ...prev,
            x: prev.x - dx,
            y: prev.y - dy,
          };
        });

        setLastMousePosition({ x: ev.clientX, y: ev.clientY });
      },
      () => {
        setError("failedToRenderCircuitError", true);
      },
    );
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
  };

  const handleWheel = (ev: React.WheelEvent) => {
    Attempt.proceed(
      () => {
        if (!ev.ctrlKey) return;

        const scaleAmount = ev.deltaY < 0 ? 0.9 : 1.1;
        const mouseX = ev.clientX / window.innerWidth;
        const mouseY = ev.clientY / window.innerHeight;

        setViewBox((prev) => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.handleWheel", "viewBox is not defined.");
          }
          const newW = prev.w * scaleAmount;
          const newH = prev.h * scaleAmount;
          return {
            x: prev.x + (prev.w - newW) * mouseX,
            y: prev.y + (prev.h - newH) * mouseY,
            w: newW,
            h: newH,
          };
        });
      },
      () => {
        setError("failedToRenderCircuitError", true);
      },
    );
  };

  const preventBrowserZoom = (ref: React.RefObject<SVGSVGElement | null>) => {
    // biome-ignore lint/correctness/useHookAtTopLevel: This is safe under the Rules of Hooks. We've just encapsulated useEffect in a local function for readability. Since it depends on a ref, it's guaranteed to run on the initial render, making it equivalent to a top-level call.
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const wheelHandler = (e: WheelEvent) => {
        if (e.ctrlKey) e.preventDefault();
      };

      el.addEventListener("wheel", wheelHandler, { passive: false });
      return () => el.removeEventListener("wheel", wheelHandler);
    }, [ref]);
  };

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
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.addCircuitNode", "Circuit is not defined.");
          }

          const next = Circuit.from({
            ...prev,
            circuitData: {
              ...prev.circuitData,
              nodes: [...prev.circuitData.nodes, newNode],
              edges: prev.circuitData.edges,
            },
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.addCircuitNode", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
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
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitNode", "Circuit is not defined.", {
              tag: "noCircuit",
            });
          }

          const updated = CircuitData.from({
            nodes: prev.circuitData.nodes.map((node) => (node.id === newNode.id ? newNode : node)),
            edges: prev.circuitData.edges,
          });

          const next = Circuit.from({
            ...prev,
            circuitData: updated,
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitNode", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
  );

  const deleteCircuitNode = useCallback(
    (nodeId: CircuitNodeId): void => {
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitNode", "Circuit is not defined.");
          }
          const deleted = prev.circuitData.nodes.find((node) => node.id === nodeId);
          if (!deleted) {
            throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitNode", "Node to delete not found.");
          }

          const updated = CircuitData.from({
            nodes: prev.circuitData.nodes.filter((node) => node.id !== nodeId),
            edges: prev.circuitData.edges.filter(
              (edge) => ![...deleted.inputs].includes(edge.to) && ![...deleted.outputs].includes(edge.from),
            ),
          });

          const next = Circuit.from({
            ...prev,
            circuitData: updated,
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitNode", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
  );

  const addCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.addCircuitEdge", "Circuit is not defined.");
          }

          const next = Circuit.from({
            ...prev,
            circuitData: CircuitData.from({
              nodes: prev.circuitData.nodes,
              edges: [...prev.circuitData.edges, newEdge],
            }),
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.addCircuitEdge", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
  );

  const updateCircuitEdge = useCallback(
    (newEdge: {
      id: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Waypoint | null;
    }): void => {
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitEdge", "Circuit is not defined.");
          }

          const updated = CircuitData.from({
            nodes: prev.circuitData.nodes,
            edges: prev.circuitData.edges.map((edge) => (edge.id === newEdge.id ? newEdge : edge)),
          });

          const next = Circuit.from({
            ...prev,
            circuitData: updated,
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.updateCircuitEdge", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
  );

  const deleteCircuitEdge = useCallback(
    (edgeId: CircuitEdgeId): void => {
      const prev = circuit;
      Attempt.proceed(
        () => {
          if (!prev) {
            throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitEdge", "Circuit is not defined.");
          }

          const updated = CircuitData.from({
            nodes: prev.circuitData.nodes,
            edges: prev.circuitData.edges.filter((edge) => edge.id !== edgeId),
          });

          const next = Circuit.from({
            ...prev,
            circuitData: updated,
          });

          const isValid = circuitEditorUsecase.isValidData(next.circuitData);
          if (!isValid.ok) {
            throw new Attempt.Abort("circuitEditorPageHandler.deleteCircuitEdge", "Invalid data.", {
              cause: isValid.error,
            });
          }

          setCircuit(next);
        },
        () => {},
      );
    },
    [circuit, circuitEditorUsecase],
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

  const focusElement: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge) => void;
  } = useCallback((kind: "node" | "edge") => {
    // biome-ignore lint/suspicious/noExplicitAny: Type safety is preserved.
    return (value: any) => {
      setFocusedElement({ kind, value });
    };
  }, []);

  const reattachFocusedElement = useCallback(() => {
    if (!focusedElement) return;

    switch (focusedElement.kind) {
      case "node": {
        const node = guiData?.nodes.find((n) => n.id === focusedElement.value.id);
        if (!node) {
          setFocusedElement(null);
          return;
        }
        setFocusedElement({ kind: "node", value: node });
        break;
      }
      case "edge": {
        const edge = guiData?.edges.find((e) => e.id === focusedElement.value.id);
        if (!edge) {
          setFocusedElement(null);
          return;
        }
        setFocusedElement({ kind: "edge", value: { ...edge, waypointIdx: focusedElement.value.waypointIdx } });
        break;
      }
    }
  }, [focusedElement, guiData]);

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

  const handleNodeMouseUp = useCallback(() => {
    setDraggingNode(null);
    reattachFocusedElement();
  }, [reattachFocusedElement]);

  const SNAP_RADIUS = 20; // 半径10px以内にいたら接続とみなす

  const findNearestPin = (coordinate: Coordinate) => {
    for (const node of guiData?.nodes ?? []) {
      for (const pin of [...node.inputs, ...node.outputs]) {
        const dx = coordinate.x - pin.coordinate.x;
        const dy = coordinate.y - pin.coordinate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SNAP_RADIUS) {
          return pin.id;
        }
      }
    }

    return null;
  };

  const handleNodePinMouseDown = (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => {
    const svgCoordinate = getSvgCoords(ev);
    if (!svgCoordinate.ok) return;

    const { x: initialMouseX, y: initialMouseY } = svgCoordinate.value;

    setDraggingNodePin({
      id: id,
      offset: Coordinate.from({ x: initialMouseX, y: initialMouseY }),
      kind: kind,
      method: method,
    });
  };

  const handleNodePinMouseMove = (ev: React.MouseEvent) => {
    if (draggingNodePin) {
      const svgCoordinate = getSvgCoords(ev);
      if (!svgCoordinate.ok) return;

      const { x, y } = svgCoordinate.value;

      setTempEdge({ from: draggingNodePin.offset, to: Coordinate.from({ x, y }) });
    }
  };

  const handleAddEdgeOnMouseUp = (ev: React.MouseEvent) => {
    const svgCoordinate = getSvgCoords(ev);
    if (!svgCoordinate.ok) return;

    const { x, y } = svgCoordinate.value;
    const toPinId = findNearestPin(Coordinate.from({ x, y }));

    if (!draggingNodePin || !toPinId) return;

    addCircuitEdge({
      id: CircuitEdgeId.generate(),
      from: draggingNodePin.kind === "from" ? draggingNodePin.id : toPinId,
      to: draggingNodePin.kind === "from" ? toPinId : draggingNodePin.id,
      waypoints: null,
    });
  };

  const handleUpdateEdgeOnMouseUp = (ev: React.MouseEvent) => {
    const svgCoordinate = getSvgCoords(ev);
    if (!svgCoordinate.ok) return;

    const { x, y } = svgCoordinate.value;

    const edgeId = guiData?.edges.find((edge) => {
      return edge.from === draggingNodePin?.id || edge.to === draggingNodePin?.id;
    })?.id;
    if (!edgeId) return;

    const prev = guiData?.edges.find((edge) => edge.id === edgeId);
    if (!prev) return;

    const toPinId = findNearestPin(Coordinate.from({ x, y }));

    if (!draggingNodePin || !toPinId) return;

    switch (draggingNodePin.kind) {
      case "from": {
        updateCircuitEdge({
          id: prev.id,
          from: draggingNodePin.id,
          to: toPinId,
          waypoints: null,
        });
        break;
      }
      case "to": {
        updateCircuitEdge({
          id: prev.id,
          from: toPinId,
          to: draggingNodePin.id,
          waypoints: null,
        });
        break;
      }
    }
  };

  const handleNodePinMouseUp = (ev: React.MouseEvent) => {
    if (!draggingNodePin) return;

    draggingNodePin.method === "ADD" ? handleAddEdgeOnMouseUp(ev) : handleUpdateEdgeOnMouseUp(ev);

    setDraggingNodePin(null);
    setTempEdge(null);
    reattachFocusedElement();
  };

  const addEdgeWaypoint = useCallback(
    (id: CircuitEdgeId) =>
      (at: Coordinate, index: number): void => {
        const prev = circuit?.circuitData?.edges.find((edge) => edge.id === id);
        if (!prev) return;
        const waypoints = prev.waypoints ? Waypoint.waypointsToCoordinateArray(prev.waypoints) : [];
        waypoints.splice(index, 0, at);

        updateCircuitEdge({
          id: prev.id,
          from: prev.from,
          to: prev.to,
          waypoints: Waypoint.coordinatesToWaypoints(waypoints),
        });
      },
    [circuit, updateCircuitEdge],
  );

  const deleteEdgeWaypoint = useCallback(
    (id: CircuitEdgeId) =>
      (index: number): void => {
        const prev = circuit?.circuitData?.edges.find((edge) => edge.id === id);
        if (!prev || !prev.waypoints) return;

        const waypoints = Waypoint.waypointsToCoordinateArray(prev.waypoints);
        if (index < 0 || index >= waypoints.length) return;

        waypoints.splice(index, 1);

        updateCircuitEdge({
          id: prev.id,
          from: prev.from,
          to: prev.to,
          waypoints: Waypoint.coordinatesToWaypoints(waypoints),
        });
      }
    ,
    [circuit, updateCircuitEdge],
  );


  const handleWaypointMouseDown =
    (id: CircuitEdgeId) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => {
      const svgCoordinate = getSvgCoords(ev);
      if (!svgCoordinate.ok) return;

      const { x: initialMouseX, y: initialMouseY } = svgCoordinate.value;

      setDraggingWaypoint({
        id,
        offset: Coordinate.from({ x: initialMouseX - offset.x, y: initialMouseY - offset.y }),
        index,
      });
    };

  const handleWaypointMouseMove = (ev: React.MouseEvent) => {
    if (!draggingWaypoint) return;

    const svgCoordinate = getSvgCoords(ev);
    if (!svgCoordinate.ok) return;

    const { x, y } = svgCoordinate.value;

    const edge = circuit?.circuitData?.edges.find((edge) => edge.id === draggingWaypoint.id);
    if (!edge || !edge.waypoints) return;

    const waypoints = Waypoint.waypointsToCoordinateArray(edge.waypoints);
    waypoints[draggingWaypoint.index] = Coordinate.from({
      x: x - draggingWaypoint.offset.x,
      y: y - draggingWaypoint.offset.y,
    });

    updateCircuitEdge({
      id: edge.id,
      from: edge.from,
      to: edge.to,
      waypoints: Waypoint.coordinatesToWaypoints(waypoints),
    });
  };

  const handleWaypointMouseUp = () => {
    setDraggingWaypoint(null);
    reattachFocusedElement();
  };

  const openUtilityMenu = useCallback(
    (kind: "node" | "edge") => (ev: React.MouseEvent) => {
      const svgCoordinate = getSvgCoords(ev);
      if (!svgCoordinate.ok) return;

      setUiState("diagramUtilityMenu", { open: kind, at: svgCoordinate.value });
    },
    [getSvgCoords, setUiState],
  );

  const closeUtilityMenu = useCallback(() => {
    setUiState("diagramUtilityMenu", { open: "none", at: null });
  }, [setUiState]);

  const openToolbarMenu = useCallback(
    (kind: "file" | "view" | "help") => {
      setUiState("toolbarMenu", { open: kind });
    },
    [setUiState],
  );

  const closeToolbarMenu = useCallback(() => {
    setUiState("toolbarMenu", { open: "none" });
  }, [setUiState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!circuit) return;

    updateCircuitGuiData();
  }, [circuit, updateCircuitGuiData]);

  return {
    error,
    circuit,
    guiData,
    viewBox,
    isPanningRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    preventBrowserZoom,
    save,
    addCircuitNode,
    updateCircuitNode,
    deleteCircuitNode,
    addCircuitEdge,
    updateCircuitEdge,
    deleteCircuitEdge,
    circuitDiagramContainer,
    svgRef,
    focusedElement,
    focusElement,
    draggingNode,
    handleNodeMouseDown,
    handleNodeMouseMove,
    handleNodeMouseUp,
    draggingNodePin,
    handleNodePinMouseDown,
    handleNodePinMouseMove,
    handleNodePinMouseUp,
    tempEdge,
    addEdgeWaypoint,
    deleteEdgeWaypoint,
    draggingWaypoint,
    handleWaypointMouseDown,
    handleWaypointMouseMove,
    handleWaypointMouseUp,
    uiState,
    openUtilityMenu,
    closeUtilityMenu,
    openToolbarMenu,
    closeToolbarMenu,
  };
};
