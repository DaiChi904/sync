import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import AndNode from "./AndNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";
import JunctionNode from "./JunctionNode";
import NotNode from "./NotNode";
import OrNode from "./OrNode";

interface NodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
}

export default function Node({ node, isInFocus, focusElement, handleNodeMouseDown }: NodeProps) {
  switch (node.type) {
    case "ENTRY":
      return (
        <EntryNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    case "EXIT":
      return (
        <ExitNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    case "JUNCTION":
      return (
        <JunctionNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    case "AND":
      return (
        <AndNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    case "OR":
      return (
        <OrNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    case "NOT":
      return (
        <NotNode
          node={node}
          isInFocus={isInFocus}
          focusElement={focusElement}
          handleNodeMouseDown={handleNodeMouseDown}
        />
      );
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}
