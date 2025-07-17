import Flex from "@/components/atoms/Flex";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import CircuitListHeader from "./CircuitListHeader";
import CircuitListItems from "./CircuitListItems";

interface CircuitListProps {
  circuitList?: Array<CircuitOverview>;
  error: boolean;
}

export default function CircuitList({ circuitList, error }: CircuitListProps) {
  return (
    <Flex direction="column" style={{ height: "100%", padding: 20 }}>
      <CircuitListHeader />
      <CircuitListItems circuitList={circuitList} error={error} />
    </Flex>
  );
}
