import Flex from "@/components/atoms/Flex";
import { Svg, SvgRect, SvgTitle } from "@/components/atoms/svg";
import type { CircuitDiagramProps } from "@/domain/model/controller/common/circuitDiagramProps";
import { ViewBox } from "@/domain/model/valueObject/viewBox";
import Edges from "./edge/Edges";
import DiagramUtilityMenuBackdrop from "./eventCaptureLayer/DiagramUtilityMenuBackdrop";
import NodeDragInteractionLayer from "./eventCaptureLayer/NodeDragInteractionLayer";
import NodePinDragInteractionLayer from "./eventCaptureLayer/NodePinDragInteractionLayer";
import WaypointDragInteractionLayer from "./eventCaptureLayer/WaypointDragInteractionLayer";
import Nodes from "./node/Nodes";
import EdgeUtilityMenu from "./utilityMenu/EdgeUtilityMenu";
import NodeUtilityMenu from "./utilityMenu/NodeUtilityMenu";

/**
 * CircuitDiagram component with structured props
 *
 * Props are organized into logical groups:
 * - data: Core circuit data (guiData, outputRecord)
 * - display: Display options (showTouchableArea)
 * - selection: Selection state (focusedElement, focusElement)
 * - viewBox: ViewBox and panning/zooming handlers
 * - nodeInteraction: Node dragging
 * - edgeInteraction: Edge and pin handling
 * - waypointInteraction: Waypoint operations
 * - utilityMenu: Right-click context menus
 */
export default function CircuitDiagram({
  data,
  display,
  selection,
  viewBox: viewBoxHandlers,
  nodeInteraction,
  edgeInteraction,
  waypointInteraction,
  utilityMenu,
}: CircuitDiagramProps) {
  const { guiData: circuitData, outputRecord } = data;

  const { showTouchableArea = false } = display ?? {};

  const { focusedElement, focusElement } = selection ?? {};

  const {
    viewBox,
    panningRef,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
  } = viewBoxHandlers ?? {};

  const { draggingNode, handleNodeMouseDown, handleNodeMouseMove, handleNodeMouseUp, deleteCircuitNode } =
    nodeInteraction ?? {};

  const {
    draggingNodePin,
    handleNodePinMouseDown,
    handleNodePinMouseMove,
    handleNodePinMouseUp,
    tempEdge,
    deleteCircuitEdge,
  } = edgeInteraction ?? {};

  const {
    addEdgeWaypoint,
    deleteEdgeWaypoint,
    handleWaypointMouseDown,
    draggingWaypoint,
    handleWaypointMouseMove,
    handleWaypointMouseUp,
  } = waypointInteraction ?? {};

  const {
    diagramUtilityMenuState = { open: "none" as const, at: null },
    openUtilityMenu,
    closeUtilityMenu,
  } = utilityMenu ?? {};

  circuitDiagramSvgRef && preventBrowserZoom && preventBrowserZoom(circuitDiagramSvgRef);

  const disableContextMenu = (ev: React.MouseEvent) => {
    ev.preventDefault();
  };

  const MARRGIN = 20;
  const hasNodes = circuitData.nodes.length > 0;
  const minX = hasNodes
    ? Math.min(...circuitData.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN
    : 0;
  const minY = hasNodes
    ? Math.min(...circuitData.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN
    : 0;
  const maxX = hasNodes
    ? Math.max(...circuitData.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN
    : 0;
  const maxY = hasNodes
    ? Math.max(...circuitData.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN
    : 0;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  return (
    <Flex
      ref={circuitDiagramContainerRef}
      direction="column"
      alignItems="center"
      justifyContent="center"
      grow={1}
      style={{ height: "100%", width: "100%", background: "var(--color-circuit-diagram-bg)" }}
    >
      <Svg
        ref={circuitDiagramSvgRef}
        viewBox={viewBox ? ViewBox.toHtmlFormat(viewBox) : `${minX} ${minY} ${viewWidth} ${viewHeight}`}
        style={{ background: "var(--color-circuit-diagram-bg)", cursor: panningRef?.current ? "grabbing" : "default" }}
        onContextMenu={disableContextMenu}
        onWheel={handleViewBoxZoom}
        onMouseDown={handleViewBoxMouseDown}
        onMouseMove={handleViewBoxMouseMove}
        onMouseUp={handleViewBoxMouseUp}
      >
        <SvgTitle>Circuit Diagram</SvgTitle>

        {showTouchableArea && (
          // biome-ignore lint/correctness/useUniqueElementIds: No need for unique id.
          <SvgRect
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
          data={circuitData}
          outputRecord={outputRecord}
          focusedElement={focusedElement}
          focusElement={focusElement?.("edge")}
          handleNodePinMouseDown={handleNodePinMouseDown}
          handleWaypointMouseDown={handleWaypointMouseDown}
          openEdgeUtilityMenu={openUtilityMenu?.("edge")}
        />

        <Nodes
          data={circuitData}
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
                {/** biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
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
                      onClickController: () => {
                        deleteCircuitEdge?.(focusedElement.value.id);
                        closeUtilityMenu?.();
                      },
                    },
                    {
                      label: "Add Waypoint",
                      onClickController: () => {
                        addEdgeWaypoint?.(focusedElement.value.id)(at, focusedElement.value.waypointIdx);
                        closeUtilityMenu?.();
                      },
                    },
                    {
                      label: "Delete Waypoint",
                      onClickController: () => {
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
                {/** biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
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
                      onClickController: () => {
                        deleteCircuitNode?.(focusedElement.value.id);
                        closeUtilityMenu?.();
                      },
                    },
                  ]}
                />
              </>
            );
          })()}
      </Svg>
    </Flex>
  );
}
