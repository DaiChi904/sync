import Flex from "@/components/atoms/Flex";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import CircuitOverviewsData from "./CircuitOverviewsData";
import CircuitOverviewsHeader from "./CircuitOverviewsHeader";

interface CircuitOverviewsProps {
  overviews?: Array<CircuitOverview>;
  error: boolean;
}

export default function CircuitOverviews({ overviews, error }: CircuitOverviewsProps) {
  return (
    <Flex direction="column" style={{ height: "100%", padding: 20 }}>
      <CircuitOverviewsHeader />
      <CircuitOverviewsData overviews={overviews} error={error} />
    </Flex>
  );
}
