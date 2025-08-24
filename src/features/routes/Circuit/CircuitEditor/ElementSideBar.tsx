import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { Coordinate } from "@/domain/model/valueObject/coordinate";

interface ElementSideBarProps {
  viewBox?: { x: number; y: number; w: number; h: number };
  addCircuitNode: (newNode: {
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
}

type NodeType = "AND" | "ENTRY" | "EXIT" | "JUNCTION" | "OR" | "NOT";
const nodes: Array<NodeType> = ["AND", "ENTRY", "EXIT", "JUNCTION", "OR", "NOT"];

export default function ElementSideBar({ viewBox, addCircuitNode }: ElementSideBarProps) {
  const centerX = viewBox ? viewBox?.x + viewBox?.w / 2 : 0;
  const centerY = viewBox ? viewBox?.y + viewBox?.h / 2 : 0;

  const add = (type: NodeType) => {
    switch (type) {
      case "AND":
      case "OR": {
        addCircuitNode({
          id: CircuitNodeId.generate(),
          type: CircuitNodeType.from(type),
          inputs: [CircuitNodePinId.generate(), CircuitNodePinId.generate()],
          outputs: [CircuitNodePinId.generate()],
          coordinate: Coordinate.from({ x: centerX, y: centerY }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        });
        break;
      }
      case "NOT":
      case "JUNCTION": {
        addCircuitNode({
          id: CircuitNodeId.generate(),
          type: CircuitNodeType.from(type),
          inputs: [CircuitNodePinId.generate()],
          outputs: [CircuitNodePinId.generate()],
          coordinate: Coordinate.from({ x: centerX, y: centerY }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        });
        break;
      }
      case "ENTRY": {
        addCircuitNode({
          id: CircuitNodeId.generate(),
          type: CircuitNodeType.from(type),
          inputs: [],
          outputs: [CircuitNodePinId.generate()],
          coordinate: Coordinate.from({ x: centerX, y: centerY }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        });
        break;
      }
      case "EXIT": {
        addCircuitNode({
          id: CircuitNodeId.generate(),
          type: CircuitNodeType.from(type),
          inputs: [CircuitNodePinId.generate()],
          outputs: [],
          coordinate: Coordinate.from({ x: centerX, y: centerY }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        });
      }
    }
  };

  return (
    // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
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
