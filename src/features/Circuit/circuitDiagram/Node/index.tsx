import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import AndNode from "./AndNode";
import EntryNode from "./EntryNode";
import ExitNode from "./ExitNode";
import JunctionNode from "./JunctionNode";
import NotNode from "./NotNode";
import OrNode from "./OrNode";

type NodeProps = CircuitGuiNode;

export default function Node({ node }: { node: NodeProps }) {
  switch (node.type) {
    case "ENTRY":
      return <EntryNode node={node} />;
    case "EXIT":
      return <ExitNode node={node} />;
    case "JUNCTION":
      return <JunctionNode node={node} />;
    case "AND":
      return <AndNode node={node} />;
    case "OR":
      return <OrNode node={node} />;
    case "NOT":
      return <NotNode node={node} />;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}
