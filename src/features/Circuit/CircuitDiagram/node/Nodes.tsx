import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import Node from "./Node";

interface CircuitDiagramProps {
  data: CircuitGuiData;
  focusedElement?: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
  focusElement?: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge) => void;
  };
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  openNodeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function Nodes({
  data,
  focusedElement,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: CircuitDiagramProps) {
  // Make focused element on top.
  const focusedNode =
    focusedElement?.kind === "node" ? data?.nodes.find((node) => node.id === focusedElement?.value.id) : undefined;
  const orderdNode = focusedNode
    ? [...data.nodes.filter((node) => node.id !== focusedElement?.value.id), focusedNode]
    : data.nodes;

  return orderdNode.map((node) => {
    const isInFocus = focusedElement?.kind === "node" && node.id === focusedElement?.value.id;
    return (
      <Node
        key={node.id}
        node={node}
        isInFocus={isInFocus}
        focusElement={focusElement?.("node")}
        handleNodeMouseDown={handleNodeMouseDown}
        handleNodePinMouseDown={handleNodePinMouseDown}
        openNodeUtilityMenu={openNodeUtilityMenu}
      />
    );
  });
}
