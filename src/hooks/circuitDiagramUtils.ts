import { useCallback, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { Coordinate } from "@/domain/model/valueObject/coordinate";

const NEAREST_THRESHOLD = 15;
const SNAP_THRESHOLD_DISTANCE = 30;
const SNAP_THRESHOLD_INITIAL_AXIS_RANGE = 125;

export const useCircuitDiagramUtils = () => {
  const findNearestPin = useCallback(
    (guiData: CircuitGuiData) => (coordinate: Coordinate) => {
      for (const node of guiData?.nodes ?? []) {
        for (const pin of [...node.inputs, ...node.outputs]) {
          const dx = coordinate.x - pin.coordinate.x;
          const dy = coordinate.y - pin.coordinate.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < NEAREST_THRESHOLD) {
            return pin.id;
          }
        }
      }

      return null;
    },
    [],
  );

  const [activeSnap, setActiveSnap] = useState<{ x: Coordinate | null; y: Coordinate | null }>({ x: null, y: null });

  const clearActiveSnap = useCallback(() => {
    setActiveSnap({ x: null, y: null });
  }, []);

  const getSnapDelta = useCallback(
    (guiData: CircuitGuiData) =>
      (currentPos: Coordinate, draggingNodeId: CircuitNodeId | null): { dx: number; dy: number } => {
        // [number, Coordinate]: `number` is the value of the axis　(eg. x = 1 on the 2d graoh) to snap to, `Coordinate` is the base coordinate for that axis.
        const snapPositionCandidatesX = new Set<[number, Coordinate]>();
        const snapPositionCandidatesY = new Set<[number, Coordinate]>();

        // Register all candidate coordinates for snapping.
        for (const node of guiData.nodes.filter((n) => n.id !== draggingNodeId)) {
          if (["ENTRY", "EXIT", "JUNCTION"].includes(node.type)) {
            snapPositionCandidatesX.add([node.coordinate.x, node.coordinate]);
            snapPositionCandidatesY.add([node.coordinate.y, node.coordinate]);
          } else {
            const nodeLeft = node.coordinate.x - node.size.x / 2;
            const nodeRight = node.coordinate.x + node.size.x / 2;
            const nodeTop = node.coordinate.y - node.size.y / 2;
            const nodeBottom = node.coordinate.y + node.size.y / 2;

            snapPositionCandidatesX.add([nodeLeft, Coordinate.from({ x: nodeLeft, y: node.coordinate.y })]);
            snapPositionCandidatesX.add([nodeRight, Coordinate.from({ x: nodeRight, y: node.coordinate.y })]);
            snapPositionCandidatesX.add([node.coordinate.x, node.coordinate]);
            snapPositionCandidatesY.add([nodeTop, Coordinate.from({ x: node.coordinate.x, y: nodeTop })]);
            snapPositionCandidatesY.add([nodeBottom, Coordinate.from({ x: node.coordinate.x, y: nodeBottom })]);
            snapPositionCandidatesY.add([node.coordinate.y, node.coordinate]);

            for (const pin of [...node.inputs, ...node.outputs]) {
              snapPositionCandidatesX.add([pin.coordinate.x, pin.coordinate]);
              snapPositionCandidatesY.add([pin.coordinate.y, pin.coordinate]);
            }
          }
        }
        for (const edge of guiData.edges) {
          for (const waypoint of edge.waypoints) {
            snapPositionCandidatesX.add([waypoint.x, waypoint]);
            snapPositionCandidatesY.add([waypoint.y, waypoint]);
          }
        }

        let dx = 0;
        let dy = 0;
        let minDeltaX: [number, Coordinate | null] = [Infinity, null];
        let minDeltaY: [number, Coordinate | null] = [Infinity, null];

        // Find the minimum delta for X and Y axes between dragging elements and snap candidates.
        const draggingNode = guiData.nodes.find((n) => n.id === draggingNodeId);
        const draggingElementCoordinates = [currentPos];
        if (draggingNode) {
          const offsetX = currentPos.x - draggingNode.coordinate.x;
          const offsetY = currentPos.y - draggingNode.coordinate.y;
          for (const pin of [...draggingNode.inputs, ...draggingNode.outputs]) {
            draggingElementCoordinates.push(
              Coordinate.from({ x: pin.coordinate.x + offsetX, y: pin.coordinate.y + offsetY }),
            );
          }
        }
        for (const coord of draggingElementCoordinates) {
          for (const [x, baseCoord] of snapPositionCandidatesX) {
            const delta = x - coord.x;
            if (Math.abs(delta) < Math.abs(minDeltaX[0])) {
              minDeltaX = [delta, baseCoord];
            }
          }

          for (const [y, baseCoord] of snapPositionCandidatesY) {
            const delta = y - coord.y;
            if (Math.abs(delta) < Math.abs(minDeltaY[0])) {
              minDeltaY = [delta, baseCoord];
            }
          }
        }

        // Determine the final snap delta, considering axis range and sticky snapping.
        const [deltaX, baseXCoord] = minDeltaX;
        const [deltaY, baseYCoord] = minDeltaY;

        // Evaluate snap conditions for the X-axis.
        const isSnapTriggeredX = Math.abs(deltaX) < SNAP_THRESHOLD_DISTANCE;
        const isInRangeX = baseXCoord && Math.abs(currentPos.y - baseXCoord.y) <= SNAP_THRESHOLD_INITIAL_AXIS_RANGE;
        const isStickySnapX = activeSnap.x?.x === baseXCoord?.x;

        let nextActiveSnapX = null;
        if (isSnapTriggeredX && (isInRangeX || isStickySnapX)) {
          dx = deltaX;
          nextActiveSnapX = baseXCoord;
        }

        // Evaluate snap conditions for the Y-axis.
        const isSnapTriggeredY = Math.abs(deltaY) < SNAP_THRESHOLD_DISTANCE;
        const isInRangeY = baseYCoord && Math.abs(currentPos.x - baseYCoord.x) <= SNAP_THRESHOLD_INITIAL_AXIS_RANGE;
        const isStickySnapY = activeSnap.y?.y === baseYCoord?.y;

        let nextActiveSnapY = null;
        if (isSnapTriggeredY && (isInRangeY || isStickySnapY)) {
          dy = deltaY;
          nextActiveSnapY = baseYCoord;
        }

        // Update the active snap state in a single call.
        setActiveSnap({ x: nextActiveSnapX, y: nextActiveSnapY });

        return { dx: dx, dy: dy };
      },
    [activeSnap],
  );

  return {
    findNearestPin,
    clearActiveSnap,
    getSnapDelta,
    activeSnap,
  };
};
