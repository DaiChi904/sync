import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";
import Edges from "./edge/Edges";
import DiagramUtilityMenuBackdrop from "./eventCaptureLayer/DiagramUtilityMenuBackdrop";
import NodeDragInteractionLayer from "./eventCaptureLayer/NodeDragInteractionLayer";
import NodePinDragInteractionLayer from "./eventCaptureLayer/NodePinDragInteractionLayer";
import WaypointDragInteractionLayer from "./eventCaptureLayer/WaypointDragInteractionLayer";
import Nodes from "./node/Nodes";
import EdgeUtilityMenu from "./utilityMenu/EdgeUtilityMenu";
import NodeUtilityMenu from "./utilityMenu/NodeUtilityMenu";

interface CircuitDiagramProps {
  showTouchableArea?: boolean;
  diagramUtilityMenuState?: {
    open: "none" | "node" | "edge";
    at: Coordinate | null;
  };
  data: CircuitGuiData;
  outputRecord?: Record<CircuitNodeId, EvalResult>;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  viewBox?: { x: number; y: number; w: number; h: number };
  isPanningRef?: React.RefObject<boolean>;
  handleMouseDown?: (ev: React.MouseEvent) => void;
  handleMouseMove?: (ev: React.MouseEvent) => void;
  handleMouseUp?: () => void;
  handleWheel?: (ev: React.WheelEvent) => void;
  preventBrowserZoom?: (ref: React.RefObject<SVGSVGElement | null>) => void;
  focusedElement?:
    | { kind: "node"; value: CircuitGuiNode }
    | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } }
    | null;
  focusElement?: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  };
  draggingNode?: CircuitGuiNode | null;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove?: (ev: React.MouseEvent) => void;
  deleteCircuitNode?: (nodeId: CircuitNodeId) => void;
  deleteCircuitEdge?: (edgeId: CircuitEdgeId) => void;
  handleNodeMouseUp?: () => void;
  draggingNodePin?: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove?: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp?: (ev: React.MouseEvent) => void;
  tempEdge?: { from: Coordinate; to: Coordinate } | null;
  addEdgeWaypoint?: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
  deleteEdgeWaypoint?: (id: CircuitEdgeId) => (index: number) => void;
  handleWaypointMouseDown?: (
    id: CircuitEdgeId,
  ) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  draggingWaypoint?: {
    id: CircuitEdgeId;
    offset: Coordinate;
    index: number;
  } | null;
  handleWaypointMouseMove?: (ev: React.MouseEvent) => void;
  handleWaypointMouseUp?: () => void;
  openUtilityMenu?: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu?: () => void;
}

export default function CircuitDiagram({
  showTouchableArea = false,
  diagramUtilityMenuState = { open: "none", at: null },
  data,
  outputRecord,
  svgRef,
  viewBox,
  isPanningRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
  preventBrowserZoom,
  focusedElement,
  focusElement,
  draggingNode,
  handleNodeMouseDown,
  handleNodeMouseMove,
  handleNodeMouseUp,
  deleteCircuitNode,
  deleteCircuitEdge,
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
  openUtilityMenu,
  closeUtilityMenu,
}: CircuitDiagramProps) {
  svgRef && preventBrowserZoom && preventBrowserZoom(svgRef);

  const disableContextMenu = (ev: React.MouseEvent) => {
    ev.preventDefault();
  };

  const MARRGIN = 20;
  const hasNodes = data.nodes.length > 0;
  const minX = hasNodes ? Math.min(...data.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN : 0;
  const minY = hasNodes ? Math.min(...data.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN : 0;
  const maxX = hasNodes ? Math.max(...data.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN : 0;
  const maxY = hasNodes ? Math.max(...data.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN : 0;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  return (
    <svg
      ref={svgRef}
      viewBox={
        viewBox ? `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}` : `${minX} ${minY} ${viewWidth} ${viewHeight}`
      }
      style={{ background: "var(--color-circuit-diagram-bg)", cursor: isPanningRef?.current ? "grabbing" : "default" }}
      onContextMenu={disableContextMenu}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <title>Circuit Diagram</title>

      {showTouchableArea && (
        // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
        <rect
          id="circuit-diagram-area"
          x={minX}
          y={minY}
          width={viewWidth}
          height={viewHeight}
          fill="none"
          stroke="#555"
          strokeDasharray="4 2"
        />
      )}

      <Edges
        data={data}
        outputRecord={outputRecord}
        focusedElement={focusedElement}
        focusElement={focusElement?.("edge")}
        handleNodePinMouseDown={handleNodePinMouseDown}
        handleWaypointMouseDown={handleWaypointMouseDown}
        openEdgeUtilityMenu={openUtilityMenu?.("edge")}
      />

      <Nodes
        data={data}
        focusedElement={focusedElement}
        focusElement={focusElement?.("node")}
        handleNodeMouseDown={handleNodeMouseDown}
        handleNodePinMouseDown={handleNodePinMouseDown}
        openNodeUtilityMenu={openUtilityMenu?.("node")}
      />

      <NodePinDragInteractionLayer
        isActive={!!draggingNodePin}
        onMouseMove={handleNodePinMouseMove}
        onMouseUp={handleNodePinMouseUp}
        tempEdge={tempEdge}
        viewBoxX={viewBox?.x}
        viewBoxY={viewBox?.y}
      />

      <WaypointDragInteractionLayer
        isActive={!!draggingWaypoint}
        onMouseMove={handleWaypointMouseMove}
        onMouseUp={handleWaypointMouseUp}
        viewBoxX={viewBox?.x}
        viewBoxY={viewBox?.y}
      />

      <NodeDragInteractionLayer
        isActive={!!draggingNode}
        onMouseMove={handleNodeMouseMove}
        onMouseUp={handleNodeMouseUp}
        viewBoxX={viewBox?.x}
        viewBoxY={viewBox?.y}
      />

      {diagramUtilityMenuState.open === "edge" &&
        focusedElement?.kind === "edge" &&
        (() => {
          const at = diagramUtilityMenuState.at;
          if (at === null) {
            closeUtilityMenu?.();
            return null;
          }

          return (
            <>
              {/** biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
              <DiagramUtilityMenuBackdrop
                id="edge-utility-menu-backdrop"
                viewBoxX={viewBox?.x}
                viewBoxY={viewBox?.y}
                onClick={() => closeUtilityMenu?.()}
              />
              <EdgeUtilityMenu
                at={at}
                menuOptions={[
                  {
                    label: "Delete",
                    onClickHandler: () => {
                      deleteCircuitEdge?.(focusedElement.value.id);
                      closeUtilityMenu?.();
                    },
                  },
                  {
                    label: "Add Waypoint",
                    onClickHandler: () => {
                      addEdgeWaypoint?.(focusedElement.value.id)(at, focusedElement.value.waypointIdx);
                      closeUtilityMenu?.();
                    },
                  },
                  {
                    label: "Delete Waypoint",
                    onClickHandler: () => {
                      deleteEdgeWaypoint?.(focusedElement.value.id)(focusedElement.value.waypointIdx);
                      closeUtilityMenu?.();
                    },
                  },
                ]}
              />
            </>
          );
        })()}

      {diagramUtilityMenuState.open === "node" &&
        focusedElement?.kind === "node" &&
        (() => {
          const at = diagramUtilityMenuState.at;
          if (at === null) {
            closeUtilityMenu?.();
            return null;
          }

          return (
            <>
              {/** biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
              <DiagramUtilityMenuBackdrop
                id="node-utility-menu-backdrop"
                viewBoxX={viewBox?.x}
                viewBoxY={viewBox?.y}
                onClick={() => closeUtilityMenu?.()}
              />
              <NodeUtilityMenu
                at={at}
                menuOptions={[
                  {
                    label: "Delete",
                    onClickHandler: () => {
                      deleteCircuitNode?.(focusedElement.value.id);
                      closeUtilityMenu?.();
                    },
                  },
                ]}
              />
            </>
          );
        })()}
    </svg>
  );
}
