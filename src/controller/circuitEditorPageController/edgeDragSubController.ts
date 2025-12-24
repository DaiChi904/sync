"use client";

import { useCallback, useState } from "react";
import { LEFT_CLICK } from "@/constants/mouseEvent";
import type { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitEdge } from "@/domain/model/entity/circuitEdge";
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { Waypoint } from "@/domain/model/valueObject/waypoint";
import type { Result } from "@/utils/result";

export interface EdgeDragSubControllerDeps {
  getSvgCoords: (ev: React.MouseEvent) => Result<Coordinate, unknown>;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
  addCircuitEdge: (newEdge: CircuitEdge) => void;
  updateCircuitEdge: (newEdge: CircuitEdge) => void;
  reattachFocusedElement: () => void;
}

const SNAP_RADIUS = 20;

export const useEdgeDragSubController = ({
  getSvgCoords,
  circuit,
  guiData,
  addCircuitEdge,
  updateCircuitEdge,
  reattachFocusedElement,
}: EdgeDragSubControllerDeps) => {
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
    if (ev.button !== LEFT_CLICK) return;

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

  const handleWaypointMouseDown =
    (id: CircuitEdgeId) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => {
      if (ev.button !== LEFT_CLICK) return;

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

  return {
    draggingNodePin,
    tempEdge,
    draggingWaypoint,
    handleNodePinMouseDown,
    handleNodePinMouseMove,
    handleNodePinMouseUp,
    handleWaypointMouseDown,
    handleWaypointMouseMove,
    handleWaypointMouseUp,
  };
};
