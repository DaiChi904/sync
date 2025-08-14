import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { ICircuitEditorPageHandler } from "@/domain/model/handler/ICircuitEditorPageHandler";
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
  showTouchableArea?: boolean;
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
  uiState?: ICircuitEditorPageHandler["uiState"];
  openUtilityMenu?: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu?: () => void;
}

export default function CircuitDiagram({
  showTouchableArea = false,
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
  openUtilityMenu,
  closeUtilityMenu,
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
        focusElement={focusElement}
        handleNodePinMouseDown={handleNodePinMouseDown}
        openEdgeUtilityMenu={openUtilityMenu?.("edge")}
      />

      <Nodes
        data={data}
        focusedElement={focusedElement}
        focusElement={focusElement}
        handleNodeMouseDown={handleNodeMouseDown}
        openNodeUtilityMenu={openUtilityMenu?.("node")}
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
        viewBoxX={viewBox?.x}
        viewBoxY={viewBox?.y}
      />

      {uiState?.diagramUtilityMenu.open === "edge" && focusedElement?.kind === "edge" && (
        <>
          <OnClickEventBackdrop
            onClick={() => {
              closeUtilityMenu?.();
            }}
          />
          <EdgeUtilityMenu
            at={uiState.diagramUtilityMenu.at}
            menuOptions={[
              {
                label: "Delete",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeUtilityMenu?.();
                },
              },
              {
                label: "Add Waypoint",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeUtilityMenu?.();
                },
              },
            ]}
          />
        </>
      )}
      {uiState?.diagramUtilityMenu.open === "node" && focusedElement?.kind === "node" && (
        <>
          <OnClickEventBackdrop
            onClick={() => {
              closeUtilityMenu?.();
            }}
          />
          <NodeUtilityMenu
            at={uiState.diagramUtilityMenu.at}
            menuOptions={[
              {
                label: "Delete",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeUtilityMenu?.();
                },
              },
              {
                label: "Add New Edge",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeUtilityMenu?.();
                },
              },
              {
                label: "Switch Inputs",
                onClickHandler: () => {
                  console.log("not implemented");
                  closeUtilityMenu?.();
                },
              },
            ]}
          />
        </>
      )}
    </svg>
  );
}
