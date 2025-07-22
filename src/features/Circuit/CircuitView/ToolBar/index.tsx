import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

interface ToolBarProps {
  circuitId?: CircuitId;
}

export default function ToolBar({ circuitId }: ToolBarProps) {
  return (
    <Grid xs={1} ys={1} xfs={3} yfs={1} container style={{ alignItems: "center", borderBottom: "1px solid #ccc" }}>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }} href={""}>
          <Flex style={{ padding: 5 }} className="animated">
            File (Not Available)
          </Flex>
        </Link>
      </Grid>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link
          style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }}
          href={`/circuit/${circuitId}/edit`}
        >
          <Flex style={{ padding: 5 }} className="animated">
            Go edit
          </Flex>
        </Link>
      </Grid>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link
          style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }}
          href={`/circuit/${circuitId}/emulation`}
        >
          <Flex style={{ padding: 5 }} className="animated">
            Go Emulate
          </Flex>
        </Link>
      </Grid>
    </Grid>
  );
}
