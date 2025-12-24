import type { DiagramUtilityMenuState } from "@/domain/model/controller/common/uiState";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import EdgeMenuContent from "./EdgeMenuContent";
import NodeMenuContent from "./NodeMenuContent";

interface DiagramUtilityMenuLayerProps {
  state: DiagramUtilityMenuState;
  focusedElement:
    | { kind: "node"; value: CircuitGuiNode }
    | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } }
    | null
    | undefined;
  viewBoxX?: number;
  viewBoxY?: number;
  closeUtilityMenu?: () => void;
  edgeActions?: {
    deleteCircuitEdge?: (edgeId: CircuitEdgeId) => void;
    addEdgeWaypoint?: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
    deleteEdgeWaypoint?: (id: CircuitEdgeId) => (index: number) => void;
  };
  nodeActions?: {
    deleteCircuitNode?: (nodeId: CircuitNodeId) => void;
  };
}

export default function DiagramUtilityMenuLayer({
  state,
  focusedElement,
  viewBoxX,
  viewBoxY,
  closeUtilityMenu,
  edgeActions,
  nodeActions,
}: DiagramUtilityMenuLayerProps) {
  // Early return if menu is not open or at position is null
  if (state.open === "none" || state.at === null) {
    return null;
  }

  const at = state.at;

  // Handle edge menu
  if (state.open === "edge" && focusedElement?.kind === "edge") {
    if (
      !closeUtilityMenu ||
      !edgeActions?.deleteCircuitEdge ||
      !edgeActions?.addEdgeWaypoint ||
      !edgeActions?.deleteEdgeWaypoint
    ) {
      return null;
    }
    return (
      <EdgeMenuContent
        at={at}
        focusedElement={focusedElement}
        viewBoxX={viewBoxX}
        viewBoxY={viewBoxY}
        closeUtilityMenu={closeUtilityMenu}
        deleteCircuitEdge={edgeActions.deleteCircuitEdge}
        addEdgeWaypoint={edgeActions.addEdgeWaypoint}
        deleteEdgeWaypoint={edgeActions.deleteEdgeWaypoint}
      />
    );
  }

  // Handle node menu
  if (state.open === "node" && focusedElement?.kind === "node") {
    if (!closeUtilityMenu || !nodeActions?.deleteCircuitNode) {
      return null;
    }
    return (
      <NodeMenuContent
        at={at}
        focusedElement={focusedElement}
        viewBoxX={viewBoxX}
        viewBoxY={viewBoxY}
        closeUtilityMenu={closeUtilityMenu}
        deleteCircuitNode={nodeActions.deleteCircuitNode}
      />
    );
  }

  return null;
}
