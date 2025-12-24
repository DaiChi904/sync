import Flex from "@/components/atoms/Flex";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import EdgeFormatPanel from "./panels/EdgeFormatPanel";
import EmptyState from "./panels/EmptyState";
import NodeFormatPanel from "./panels/NodeFormatPanel";

interface FormatSideBarProps {
  data: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
}

export default function FormatSideBar({ data }: FormatSideBarProps) {
  const renderContent = () => {
    if (!data) return <EmptyState />;
    if (data.kind === "node") return <NodeFormatPanel node={data.value} />;
    return <EdgeFormatPanel edge={data.value} />;
  };

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: No need for unique id.
    <Flex id="format-side-bar" direction="column" style={{ maxWidth: "100%", height: "100%", padding: 5 }}>
      {renderContent()}
    </Flex>
  );
}
