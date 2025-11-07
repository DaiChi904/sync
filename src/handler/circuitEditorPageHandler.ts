"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitEdge } from "@/domain/model/entity/circuitEdge";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNode } from "@/domain/model/entity/circuitNode";
import {
  type CircuitEditorPageErrorModel,
  CircuitEditorPageHandlerError,
  type CircuitEditorPageUiStateModel,
  type ICircuitEditorPageHandler,
  initialCircuitEditorPageError,
} from "@/domain/model/handler/ICircuitEditorPageHandler";
import type { ICircuitRepository } from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IDeleteCircuitUsecase } from "@/domain/model/usecase/IDeleteCircuitUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { IUpdateCircuitUsecase } from "@/domain/model/usecase/IUpdateCircuitUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { Waypoint } from "@/domain/model/valueObject/waypoint";
import { usePartialState } from "@/hooks/partialState";
import type { Result } from "@/utils/result";

interface CircuitEditorPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  circuitParserUsecase: ICircuitParserService;
  updateCircuitUsecase: IUpdateCircuitUsecase;
  deleteCircuitUsecase: IDeleteCircuitUsecase;
  circuitRepository: ICircuitRepository;
}

export const useCircuitEditorPageHandler = ({
  query,
  getCircuitDetailUsecase,
  circuitParserUsecase,
  updateCircuitUsecase,
  deleteCircuitUsecase,
}: CircuitEditorPageHandlerDependencies): ICircuitEditorPageHandler => {
  const router = useRouter();

  const [error, setError] = usePartialState<CircuitEditorPageErrorModel>(initialCircuitEditorPageError);
  const [uiState, setUiState] = usePartialState<CircuitEditorPageUiStateModel>({
    toolbarMenu: { open: "none" },
    diagramUtilityMenu: { open: "none", at: null },
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "infomation" },
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
    const circuitDetail = await getCircuitDetailUsecase.getById(query);
    if (!circuitDetail.ok) {
      const err = new CircuitEditorPageHandlerError("Failed to get circuit detail.", {
        cause: circuitDetail.error,
      });
      console.error(err);

      setError("failedToGetCircuitDetailError", true);
      return;
    }

    setCircuit(circuitDetail.value);
  }, [query, getCircuitDetailUsecase, setError]);

  const updateCircuitGuiData = useCallback((): void => {
    if (!circuit) {
      const err = new CircuitEditorPageHandlerError("Unable to update gui data. Circuit is not defined.");
      console.error(err);

      setError("failedToParseCircuitDataError", true);
      return;
    }

    const circuitGuiData = circuitParserUsecase.parseToGuiData(circuit.circuitData);
    if (!circuitGuiData.ok) {
      const err = new CircuitEditorPageHandlerError(
        "Failed to update gui data. Failed to parse circuit data to gui data.",
        {
          cause: circuitGuiData.error,
        },
      );
      console.error(err);

      setError("failedToParseCircuitDataError", true);
      return;
    }

    setGuiData(circuitGuiData.value);

    //-- define INITIAL viewbox value --//
    if (viewBox || !circuitDiagramContainer.current) return;

    const MARRGIN = 20;
    const hasNodes = circuit.circuitData.nodes.length > 0;
    const minX = hasNodes
      ? Math.min(...circuit.circuitData.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN
      : 0;
    const minY = hasNodes
      ? Math.min(...circuit.circuitData.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN
      : 0;
    const maxX = hasNodes
      ? Math.max(...circuit.circuitData.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN
      : 0;
    const maxY = hasNodes
      ? Math.max(...circuit.circuitData.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN
      : 0;
    const viewWidth = circuitDiagramContainer.current.clientWidth;
    const viewHeight = circuitDiagramContainer.current.clientHeight;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setViewBox({ x: centerX - viewWidth / 2, y: centerY - viewHeight / 2, w: viewWidth, h: viewHeight });
    //-- define INITIAL viewbox value --//
  }, [circuit, circuitParserUsecase, viewBox, setError]);

  const handleViewBoxMouseDown = (ev: React.MouseEvent) => {
    // On right click.
    if (ev.button !== 2) return;

    isPanningRef.current = true;
    setLastMousePosition({ x: ev.clientX, y: ev.clientY });
  };

  const handleViewBoxMouseMove = (ev: React.MouseEvent) => {
    if (!isPanningRef.current || !lastMousePosition) return;

    if (!viewBox) return;

    const dx = (ev.clientX - lastMousePosition.x) * (viewBox.w / window.innerWidth);
    const dy = (ev.clientY - lastMousePosition.y) * (viewBox.h / window.innerHeight);

    setViewBox((prev) => {
      if (!prev) {
        const err = new CircuitEditorPageHandlerError("Unable to handle ViewBox move. ViewBox is not defined.");
        console.error(err);

        setError("failedToRenderCircuitError", true);
        return prev;
      }
      return {
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy,
      };
    });

    setLastMousePosition({ x: ev.clientX, y: ev.clientY });
  };

  const handleViewBoxMouseUp = () => {
    isPanningRef.current = false;
  };

  const handleViewBoxZoom = (ev: React.WheelEvent) => {
    if (!ev.ctrlKey) return;

    const scaleAmount = ev.deltaY < 0 ? 0.9 : 1.1;
    const mouseX = ev.clientX / window.innerWidth;
    const mouseY = ev.clientY / window.innerHeight;

    setViewBox((prev) => {
      if (!prev) {
        const err = new CircuitEditorPageHandlerError("Unable to handle ViewBox zoom. ViewBox is not defined.");
        console.error(err);

        setError("failedToRenderCircuitError", true);
        return;
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
    if (!circuit) {
      const err = new CircuitEditorPageHandlerError("Unable to save. Circuit is not defined.");
      console.error(err);

      setError("failedToSaveCircuitError", true);
      return;
    }

    const res = await updateCircuitUsecase.execute(circuit);
    if (!res.ok) {
      const err = new CircuitEditorPageHandlerError("Failed to save circuit.", {
        cause: res.error,
      });
      console.error(err);

      setError("failedToSaveCircuitError", true);
      return;
    }

    setError("failedToSaveCircuitError", false);
  }, [circuit, updateCircuitUsecase, setError]);

  const deleteCircuit = useCallback(async () => {
    if (!circuit) {
      const err = new CircuitEditorPageHandlerError("Unable to delete circuit. Circuit is not defined.");
      console.error(err);

      return;
    }

    const res = await deleteCircuitUsecase.execute(circuit.id);
    if (!res.ok) {
      const err = new CircuitEditorPageHandlerError("Failed to delete circuit.", {
        cause: res.error,
      });
      console.error(err);

      return;
    }

    router.push("/");
  }, [circuit, deleteCircuitUsecase, router]);

  const changeTitle = useCallback((title: CircuitTitle): void => {
    try {
      setCircuit((prev) => {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to change title. Circuit is not defined.");
        }
        return Circuit.changeTitle(prev, title);
      });
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  const changeDescription = useCallback((description: CircuitDescription): void => {
    try {
      setCircuit((prev) => {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to change title. Circuit is not defined.");
        }
        return Circuit.changeDescription(prev, description);
      });
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  const addCircuitNode = useCallback(
    (newNode: CircuitNode): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to add circuit node. Circuit is not defined.");
        }

        const nodeAddResult = CircuitData.addNode(prev.circuitData, newNode);
        if (!nodeAddResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to add circuit node.", {
            cause: nodeAddResult.error,
          });
        }

        const next = Circuit.changeCircuitData(prev, nodeAddResult.value);

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const updateCircuitNode = useCallback(
    (newNode: CircuitNode): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to update circuit node. Circuit is not defined.");
        }

        const nodeUpdateResult = CircuitData.updateNode(prev.circuitData, newNode);
        if (!nodeUpdateResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to update circuit node.", {
            cause: nodeUpdateResult.error,
          });
        }

        const next = Circuit.from({
          ...prev,
          circuitData: nodeUpdateResult.value,
        });

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const deleteCircuitNode = useCallback(
    (nodeId: CircuitNodeId): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to delete circuit node. Circuit is not defined.");
        }

        const nodeDeleteResult = CircuitData.deleteNode(prev.circuitData, nodeId);
        if (!nodeDeleteResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to delete circuit node.", {
            cause: nodeDeleteResult.error,
          });
        }

        const next = Circuit.from({
          ...prev,
          circuitData: nodeDeleteResult.value,
        });

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const addCircuitEdge = useCallback(
    (newEdge: CircuitEdge): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to add circuit edge. Circuit is not defined.");
        }

        const edgeAddResult = CircuitData.addEdge(prev.circuitData, newEdge);
        if (!edgeAddResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to add circuit edge.", {
            cause: edgeAddResult.error,
          });
        }

        const next = Circuit.from({
          ...prev,
          circuitData: edgeAddResult.value,
        });

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const updateCircuitEdge = useCallback(
    (newEdge: CircuitEdge): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to update circuit edge. Circuit is not defined.");
        }

        const edgeUpdateResult = CircuitData.updateEdge(prev.circuitData, newEdge);
        if (!edgeUpdateResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to update circuit edge.", {
            cause: edgeUpdateResult.error,
          });
        }

        const next = Circuit.from({
          ...prev,
          circuitData: edgeUpdateResult.value,
        });

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const deleteCircuitEdge = useCallback(
    (edgeId: CircuitEdgeId): void => {
      const prev = circuit;
      try {
        if (!prev) {
          throw new CircuitEditorPageHandlerError("Unable to delete circuit edge. Circuit is not defined.");
        }

        const edgeDeleteResult = CircuitData.deleteEdge(prev.circuitData, edgeId);
        if (!edgeDeleteResult.ok) {
          throw new CircuitEditorPageHandlerError("Failed to delete circuit edge.", {
            cause: edgeDeleteResult.error,
          });
        }

        const next = Circuit.from({
          ...prev,
          circuitData: edgeDeleteResult.value,
        });

        setCircuit(next);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [circuit],
  );

  const getSvgCoords = useCallback((ev: React.MouseEvent): Result<Coordinate, CircuitEditorPageHandlerError> => {
    try {
      const svg = svgRef.current;
      if (!svg) {
        throw new CircuitEditorPageHandlerError("Unable to get svg coordinates. svgRef is null.");
      }

      const pt = svg.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      return { ok: true, value: Coordinate.from({ x: cursorPt.x, y: cursorPt.y }) };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEditorPageHandlerError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEditorPageHandlerError("Unknow error occurred when trying to get svg coordinates.", {
          cause: err,
        }),
      };
    }
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
      if (ev.button !== 0) return;

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
    if (ev.button !== 0) return;

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

    addCircuitEdge(
      CircuitEdge.from({
        id: CircuitEdgeId.generate(),
        from: draggingNodePin.kind === "from" ? draggingNodePin.id : toPinId,
        to: draggingNodePin.kind === "from" ? toPinId : draggingNodePin.id,
        waypoints: null,
      }),
    );
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
        updateCircuitEdge(
          CircuitEdge.from({
            id: prev.id,
            from: draggingNodePin.id,
            to: toPinId,
            waypoints: null,
          }),
        );
        break;
      }
      case "to": {
        updateCircuitEdge(
          CircuitEdge.from({
            id: prev.id,
            from: toPinId,
            to: draggingNodePin.id,
            waypoints: null,
          }),
        );
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

        updateCircuitEdge(
          CircuitEdge.from({
            id: prev.id,
            from: prev.from,
            to: prev.to,
            waypoints: Waypoint.coordinatesToWaypoints(waypoints),
          }),
        );
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

        updateCircuitEdge(
          CircuitEdge.from({
            id: prev.id,
            from: prev.from,
            to: prev.to,
            waypoints: Waypoint.coordinatesToWaypoints(waypoints),
          }),
        );
      },
    [circuit, updateCircuitEdge],
  );

  const handleWaypointMouseDown =
    (id: CircuitEdgeId) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => {
      if (ev.button !== 0) return;

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

    updateCircuitEdge(
      CircuitEdge.from({
        id: edge.id,
        from: edge.from,
        to: edge.to,
        waypoints: Waypoint.coordinatesToWaypoints(waypoints),
      }),
    );
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
    (kind: "infomation" | "circuitDiagram" | "rowCircuitData") => {
      setUiState("activityBarMenu", { open: kind });
    },
    [setUiState],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCircuitGuiData is depends on circuitDiagramContainer defined when activityBarMenu.open is "circuitDiagram". To define viewbox correctly, uiState.activityBarMenu.open in dependencies are essential.
  useEffect(() => {
    if (!circuit) return;

    updateCircuitGuiData();
  }, [circuit, updateCircuitGuiData, uiState.activityBarMenu.open]);

  return {
    error,
    circuit,
    guiData,
    viewBox,
    isPanningRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
    save,
    deleteCircuit,
    changeTitle,
    changeDescription,
    addCircuitNode,
    deleteCircuitNode,
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
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  };
};
