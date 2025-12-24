import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import type { CircuitNode } from "@/domain/model/entity/circuitNode";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { Coordinate } from "@/domain/model/valueObject/coordinate";

interface ElementSideBarProps {
  viewBox?: { x: number; y: number; w: number; h: number };
  createCircuitNode: (type: CircuitNodeType, coordinate: Coordinate) => CircuitNode;
  addCircuitNode: (newNode: CircuitNode) => void;
}

type NodeType = "AND" | "ENTRY" | "EXIT" | "JUNCTION" | "OR" | "NOT";
const nodes: Array<NodeType> = ["AND", "ENTRY", "EXIT", "JUNCTION", "OR", "NOT"];

export default function ElementSideBar({ viewBox, createCircuitNode, addCircuitNode }: ElementSideBarProps) {
  const centerX = viewBox ? viewBox.x + viewBox.w / 2 : 0;
  const centerY = viewBox ? viewBox.y + viewBox.h / 2 : 0;

  const add = (type: NodeType) => {
    const coordinate = Coordinate.from({ x: centerX, y: centerY });
    const newNode = createCircuitNode(CircuitNodeType.from(type), coordinate);
    addCircuitNode(newNode);
  };

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: No need for unique id.
    <Flex id="element-side-bar" direction="column" style={{ height: "100%", padding: 5 }}>
      <Typography>Logic gates</Typography>
      <Flex wrap="wrap" style={{ marginTop: 10 }}>
        {nodes.map((type) => (
          <SecondaryButton
            key={type}
            variant="filled"
            animation="push"
            style={{ textAlign: "center", height: 50, padding: "5px", width: "50%", border: "none" }}
            onClick={() => add(type)}
          >
            {type}
          </SecondaryButton>
        ))}
      </Flex>
    </Flex>
  );
}
