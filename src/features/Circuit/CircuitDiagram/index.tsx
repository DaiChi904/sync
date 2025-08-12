import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";
import Edges from "./edge/Edges";
import OnClickEventBackdrop from "./eventCaptureLayer/baseLayers/onClickEventBackdrop";
import NodeDragInteractionLayer from "./eventCaptureLayer/NodeDragInteractionLayer";
import NodePinDragInteractionLayer from "./eventCaptureLayer/NodePinDragInteractionLayer";
import Nodes from "./node/Nodes";
import EdgeUtilityMenu from "./utilityMenu/EdgeUtilityMenu";
import NodeUtilityMenu from "./utilityMenu/NodeUtilityMenu";

interface CircuitDiagramProps {
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
  focusedElement?: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
  focusElement?: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge) => void;
  };
  draggingNode?: CircuitGuiNode | null;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove?: (ev: React.MouseEvent) => void;
  handleNodeMouseUp?: () => void;
  draggingNodePin?: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to" | "waypoints";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove?: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp?: (ev: React.MouseEvent) => void;
  tempEdge?: { from: Coordinate; to: Coordinate } | null;
  uiState?: {
    isOpenEdgeUtilityMenu: { open: boolean; at: Coordinate | null };
    isOpenNodeUtilityMenu: { open: boolean; at: Coordinate | null };
  };
  openEdgeUtilityMenu?: (ev: React.MouseEvent) => void;
  closeEdgeUtilityMenu?: () => void;
  openNodeUtilityMenu?: (ev: React.MouseEvent) => void;
  closeNodeUtilityMenu?: () => void;
}

export default function CircuitDiagram({
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
  draggingNodePin,
  handleNodePinMouseDown,
  handleNodePinMouseMove,
  handleNodePinMouseUp,
  tempEdge,
  uiState,
  openEdgeUtilityMenu,
  closeEdgeUtilityMenu,
  openNodeUtilityMenu,
  closeNodeUtilityMenu,
}: CircuitDiagramProps) {
  svgRef && preventBrowserZoom && preventBrowserZoom(svgRef);

  const disableContextMenu = (ev: React.MouseEvent) => {
    ev.preventDefault();
  };

  const MARRGIN = 20;
  const minX = Math.min(...data.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN;
  const minY = Math.min(...data.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN;
  const maxX = Math.max(...data.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN;
  const maxY = Math.max(...data.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  return (
    <svg
      ref={svgRef}
      viewBox={
        viewBox ? `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}` : `${minX} ${minY} ${viewWidth} ${viewHeight}`
      }
      style={{ background: "#222", cursor: isPanningRef?.current ? "grabbing" : "default" }}
      onContextMenu={disableContextMenu}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <title>Circuit Diagram</title>

      <Edges
        data={data}
        outputRecord={outputRecord}
        focusedElement={focusedElement}
        focusElement={focusElement}
        handleNodePinMouseDown={handleNodePinMouseDown}
        openEdgeUtilityMenu={openEdgeUtilityMenu}
      />

      <Nodes
        data={data}
        focusedElement={focusedElement}
        focusElement={focusElement}
        handleNodeMouseDown={handleNodeMouseDown}
        openNodeUtilityMenu={openNodeUtilityMenu}
      />

      <NodePinDragInteractionLayer
        isActive={!!draggingNodePin}
        onMouseMove={handleNodePinMouseMove}
        onMouseUp={handleNodePinMouseUp}
        tempEdge={tempEdge}
      />

      <NodeDragInteractionLayer
        isActive={!!draggingNode}
        onMouseMove={handleNodeMouseMove}
        onMouseUp={handleNodeMouseUp}
      />

      {uiState?.isOpenEdgeUtilityMenu.open && focusedElement?.kind === "edge" && (
        <>
          <OnClickEventBackdrop
            onClick={() => {
              closeEdgeUtilityMenu?.();
            }}
          />
          <EdgeUtilityMenu
            at={uiState.isOpenEdgeUtilityMenu.at}
            menuOptions={[
              {
                label: "Delete",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeEdgeUtilityMenu?.();
                },
              },
              {
                label: "Add Waypoint",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeEdgeUtilityMenu?.();
                },
              },
            ]}
          />
        </>
      )}
      {uiState?.isOpenNodeUtilityMenu.open && focusedElement?.kind === "node" && (
        <>
          <OnClickEventBackdrop
            onClick={() => {
              closeNodeUtilityMenu?.();
            }}
          />
          <NodeUtilityMenu
            at={uiState.isOpenNodeUtilityMenu.at}
            menuOptions={[
              {
                label: "Delete",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeNodeUtilityMenu?.();
                },
              },
              {
                label: "Add New Edge",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeNodeUtilityMenu?.();
                },
              },
              {
                label: "Switch Inputs",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeNodeUtilityMenu?.();
                },
              },
            ]}
          />
        </>
      )}
    </svg>
  );
}
