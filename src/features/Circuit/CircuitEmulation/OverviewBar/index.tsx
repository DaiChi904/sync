import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import Typography from "@/components/atoms/Typography";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";

interface OverviewBarProps {
  overview: CircuitOverview | undefined;
  error: boolean;
}

export default function OverviewBar({ overview, error }: OverviewBarProps) {
  switch (true) {
    case !error && overview !== undefined: {
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
            <Typography size="large">{overview.title}</Typography>
          </Grid>
          <Grid xs={4} ys={1} xfs={1} yfs={1} className="one-line-clamp">
            <Typography size="default">{overview.description}</Typography>
          </Grid>
          <Grid xs={2} ys={1} xfs={1} yfs={1} className="one-line-clamp">
            <Typography size="default">
              {!overview.updatedAt ? `Created at: ${overview.createdAt}` : `Last updated at: ${overview.updatedAt}`}
            </Typography>
          </Grid>
          <Grid xs={4} ys={1} xfs={2} yfs={1} style={{ justifyItems: "end" }}>
            <Link
              style={{ display: "block", textDecoration: "none", color: "inherit", width: "50%" }}
              href={`/circuit/${overview.id}`}
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
