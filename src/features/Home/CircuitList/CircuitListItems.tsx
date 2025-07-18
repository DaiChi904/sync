import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";

interface CircuitListProps {
  circuitList?: Array<CircuitOverview>;
  error: boolean;
}

export default function CircuitListItems({ circuitList, error }: CircuitListProps) {
  switch (true) {
    case !error && circuitList === undefined: {
      return (
        <Flex alignItems="center" justifyContent="center" grow={1}>
          <LoadingPuls />
        </Flex>
      );
    }
    // biome-ignore lint/style/noNonNullAssertion: Non null is asserted at first case.
    case !error && circuitList!.length === 0: {
      return (
        <Flex alignItems="center" justifyContent="center" grow={1}>
          <Typography>No circuit</Typography>
        </Flex>
      );
    }
    // biome-ignore lint/style/noNonNullAssertion: Non null is asserted at first case.
    case !error && circuitList!.length > 0: {
      return (
        <Flex direction="column" gap={0}>
          {circuitList?.map((c) => (
            <Link
              key={c.id}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
              href={`/circuits/${c.id}`}
            >
              <Flex style={{ padding: 5, borderBottom: "1px solid #ccc" }} className="animated" gap={5}>
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
      );
    }
    case error: {
      return (
        <Flex alignItems="center" justifyContent="center" grow={1}>
          <Typography>Failed to get circuit list</Typography>
        </Flex>
      );
    }
    default: {
      return (
        <Flex alignItems="center" justifyContent="center" grow={1}>
          <Typography>Something went wrong</Typography>
        </Flex>
      );
    }
  }
}
