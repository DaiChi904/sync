import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import { SafePending } from "@/components/atoms/utils/SafePending";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";

interface CircuitListProps {
  circuitList?: Array<CircuitOverview>;
  error: boolean;
}

export default function CircuitListItems({ circuitList, error }: CircuitListProps) {
  return (
    <SafePending
      data={circuitList}
      isLoading={!circuitList}
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
      {(circuitList) => (
        <Flex direction="column" grow={1}>
          {circuitList.map((c) => (
            <Link
              key={c.id}
              className="button-primary-link button-animation-push no-style-link"
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
              href={`/circuit/${c.id}`}
            >
              <Flex style={{ padding: 5, borderBottom: "1px solid #ccc", gap: 5 }}>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {c.title}
                </Flex>
                <Flex style={{ width: "40%" }} alignItems="center">
                  {c.description}
                </Flex>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {c.createdAt}
                </Flex>
                <Flex style={{ width: "20%" }} alignItems="center">
                  {c.updatedAt}
                </Flex>
              </Flex>
            </Link>
          ))}
        </Flex>
      )}
    </SafePending>
  );
}
