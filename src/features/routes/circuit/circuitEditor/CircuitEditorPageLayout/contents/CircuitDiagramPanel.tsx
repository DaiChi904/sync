import type { RefObject } from "react";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import { SafePending } from "@/components/atoms/utils/SafePending";
import type { DiagramUtilityMenuState } from "@/domain/model/controller/common/uiState";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNode } from "@/domain/model/entity/circuitNode";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { ViewBox } from "@/domain/model/valueObject/viewBox";
import CircuitDiagram from "../../../../../common/circuitDiagram";
import ElementSideBar from "../../ElementSideBar";
import FormatSideBar from "../../FormatSideBar";

interface CircuitDiagramPanelProps {
  guiData: CircuitGuiData | undefined;
  isLoading: boolean;
  isError: boolean;
  viewBox: ViewBox;
  panningRef: React.RefObject<boolean>;
  circuitDiagramContainerRef: RefObject<HTMLDivElement | null>;
  circuitDiagramSvgRef: RefObject<SVGSVGElement | null>;
  handleViewBoxMouseDown: (ev: React.MouseEvent) => void;
  handleViewBoxMouseMove: (ev: React.MouseEvent) => void;
  handleViewBoxMouseUp: () => void;
  handleViewBoxZoom: (ev: React.WheelEvent) => void;
  preventBrowserZoom: (ref: RefObject<SVGSVGElement | null>) => void;
  addCircuitNode: (newNode: CircuitNode) => void;
  createCircuitNode: (type: CircuitNodeType, coordinate: Coordinate) => CircuitNode;
  focusedElement:
    | { kind: "node"; value: CircuitGuiNode }
    | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } }
    | null;
  focusElement: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  };
  draggingNode: CircuitGuiNode | null;
  handleNodeMouseDown: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove: (ev: React.MouseEvent) => void;
  handleNodeMouseUp: () => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
  draggingNodePin: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp: (ev: React.MouseEvent) => void;
  tempEdge: { from: Coordinate; to: Coordinate } | null;
  deleteCircuitEdge: (edgeId: CircuitEdgeId) => void;
  addEdgeWaypoint: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
  deleteEdgeWaypoint: (id: CircuitEdgeId) => (index: number) => void;
  draggingWaypoint: {
    id: CircuitEdgeId;
    offset: Coordinate;
    index: number;
  } | null;
  handleWaypointMouseDown: (id: CircuitEdgeId) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  handleWaypointMouseMove: (ev: React.MouseEvent) => void;
  handleWaypointMouseUp: () => void;
  diagramUtilityMenu: DiagramUtilityMenuState;
  openUtilityMenu: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu: () => void;
}

export default function CircuitDiagramPanel({
  guiData,
  isLoading,
  isError,
  viewBox,
  panningRef,
  circuitDiagramContainerRef,
  circuitDiagramSvgRef,
  handleViewBoxMouseDown,
  handleViewBoxMouseMove,
  handleViewBoxMouseUp,
  handleViewBoxZoom,
  preventBrowserZoom,
  addCircuitNode,
  createCircuitNode,
  focusedElement,
  focusElement,
  draggingNode,
  handleNodeMouseDown,
  handleNodeMouseMove,
  handleNodeMouseUp,
  deleteCircuitNode,
  draggingNodePin,
  handleNodePinMouseDown,
  handleNodePinMouseMove,
  handleNodePinMouseUp,
  tempEdge,
  deleteCircuitEdge,
  addEdgeWaypoint,
  deleteEdgeWaypoint,
  draggingWaypoint,
  handleWaypointMouseDown,
  handleWaypointMouseMove,
  handleWaypointMouseUp,
  diagramUtilityMenu,
  openUtilityMenu,
  closeUtilityMenu,
}: CircuitDiagramPanelProps) {
  return (
    <Grid xfs={8} container grow={1}>
      <Grid xs={1} grow={1}>
        <ElementSideBar viewBox={viewBox} createCircuitNode={createCircuitNode} addCircuitNode={addCircuitNode} />
      </Grid>
      <Grid
        xs={5}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <SafePending
          data={guiData}
          isLoading={isLoading}
          isError={isError}
          fallback={{
            onLoading: () => <LoadingPuls />,
            onError: () => <Typography>Something went wrong</Typography>,
          }}
        >
          {(guiData) => (
            <CircuitDiagram
              data={{ guiData }}
              display={{ showTouchableArea: true }}
              selection={{ focusedElement, focusElement }}
              viewBox={{
                viewBox,
                panningRef,
                circuitDiagramContainerRef,
                circuitDiagramSvgRef,
                handleViewBoxMouseDown,
                handleViewBoxMouseMove,
                handleViewBoxMouseUp,
                handleViewBoxZoom,
                preventBrowserZoom,
              }}
              nodeInteraction={{
                draggingNode,
                handleNodeMouseDown,
                handleNodeMouseMove,
                handleNodeMouseUp,
                deleteCircuitNode,
              }}
              edgeInteraction={{
                draggingNodePin,
                handleNodePinMouseDown,
                handleNodePinMouseMove,
                handleNodePinMouseUp,
                tempEdge,
                deleteCircuitEdge,
              }}
              waypointInteraction={{
                addEdgeWaypoint,
                deleteEdgeWaypoint,
                draggingWaypoint,
                handleWaypointMouseDown,
                handleWaypointMouseMove,
                handleWaypointMouseUp,
              }}
              utilityMenu={{
                diagramUtilityMenuState: diagramUtilityMenu,
                openUtilityMenu,
                closeUtilityMenu,
              }}
            />
          )}
        </SafePending>
      </Grid>
      <Grid xs={2} grow={1}>
        <FormatSideBar data={focusedElement} />
      </Grid>
    </Grid>
  );
}
