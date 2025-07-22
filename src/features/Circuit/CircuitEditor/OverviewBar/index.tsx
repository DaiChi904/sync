import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import Typography from "@/components/atoms/Typography";
import type { Circuit } from "@/domain/model/aggregate/circuit";

interface OverviewBarProps {
  circuit: Circuit | undefined;
  error: boolean;
}

export default function OverviewBar({ circuit, error }: OverviewBarProps) {
  switch (true) {
    case !error && circuit !== undefined: {
      return (
        <Grid
          xs={1}
          ys={1}
          xfs={12}
          yfs={1}
          container
          style={{ alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: 10 }}
        >
          <Grid xs={2} ys={1} xfs={1} yfs={1} className="one-line-clamp">
            <Typography size="large">{circuit.title}</Typography>
          </Grid>
          <Grid xs={4} ys={1} xfs={1} yfs={1} className="one-line-clamp">
            <Typography size="default">{circuit.description}</Typography>
          </Grid>
          <Grid xs={2} ys={1} xfs={1} yfs={1} className="one-line-clamp">
            <Typography size="default">
              {!circuit.updatedAt ? `Created at: ${circuit.createdAt}` : `Last updated at: ${circuit.updatedAt}`}
            </Typography>
          </Grid>
          <Grid xs={4} ys={1} xfs={2} yfs={1} style={{ justifyItems: "end" }}>
            <Link
              style={{ display: "block", textDecoration: "none", color: "inherit", width: "50%" }}
              href={`/circuit/${circuit.id}`}
            >
              <Flex style={{ padding: 5 }} className="animated">
                Return to Circuit view
              </Flex>
            </Link>
          </Grid>
        </Grid>
      );
    }
    default: {
      return (
        <Grid
          xs={1}
          ys={1}
          xfs={12}
          yfs={1}
          container
          style={{ alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: 10 }}
        >
          <Grid xs={8} ys={1} xfs={1} yfs={1} />
          <Grid xs={4} ys={1} xfs={2} yfs={1} style={{ justifyItems: "end" }}>
            <Link style={{ display: "block", textDecoration: "none", color: "inherit", width: "50%" }} href={`/`}>
              <Flex style={{ padding: 5 }} className="animated">
                Return to Home
              </Flex>
            </Link>
          </Grid>
        </Grid>
      );
    }
  }
}
