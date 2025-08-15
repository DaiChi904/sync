import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import AndNode from "./logicGates/AndNode";
import EntryNode from "./logicGates/EntryNode";
import ExitNode from "./logicGates/ExitNode";
import JunctionNode from "./logicGates/JunctionNode";
import NotNode from "./logicGates/NotNode";
import OrNode from "./logicGates/OrNode";

interface NodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  openNodeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function Node({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: NodeProps) {
  switch (node.type) {
    case "ENTRY":
      return (
        <EntryNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    case "EXIT":
      return (
        <ExitNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    case "JUNCTION":
      return (
        <JunctionNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    case "AND":
      return (
        <AndNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    case "OR":
      return (
        <OrNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    case "NOT":
      return (
        <NotNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
          handleNodePinMouseDown={handleNodePinMouseDown}
          openNodeUtilityMenu={isInFocus ? openNodeUtilityMenu : undefined}
        />
      );
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}
