import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import { SafePending } from "@/components/atoms/utils/SafePending";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";

interface CircuitOverviewsProps {
  overviews?: Array<CircuitOverview>;
  error: boolean;
}

export default function CircuitOverviewsData({ overviews, error }: CircuitOverviewsProps) {
  return (
    <SafePending
      data={overviews}
      isLoading={!overviews}
      isError={error}
      fallback={{
        onLoading: () => (
          <Flex direction="column" alignItems="center" justifyContent="center" grow={1}>
            <LoadingPuls />
          </Flex>
        ),
        onError: () => (
          <Flex direction="column" alignItems="center" justifyContent="center" grow={1}>
            <Typography>Failed to get circuit list</Typography>
          </Flex>
        ),
      }}
    >
      {(overviews) => (
        <Flex direction="column" grow={1}>
          {overviews.map((overview) => (
            <Link
              key={overview.id}
              className="button-primary-link button-animation-push no-style-link"
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
              href={`/circuit/${overview.id}`}
            >
              <Flex style={{ padding: 5, borderBottom: "1px solid #ccc", gap: 5 }}>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {overview.title}
                </Flex>
                <Flex style={{ width: "40%" }} alignItems="center">
                  {overview.description}
                </Flex>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {overview.createdAt}
                </Flex>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {overview.updatedAt}
                </Flex>
              </Flex>
            </Link>
          ))}
        </Flex>
      )}
    </SafePending>
  );
}
