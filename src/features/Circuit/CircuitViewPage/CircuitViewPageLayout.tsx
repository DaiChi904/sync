import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitViewPageHandlerContext } from "@/contexts/CircuitViewPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import OverviewBar from "./OverviewBar";

export default function CircuitViewPageLayout() {
  const { error, overview, guiData } = useCircuitViewPageHandlerContext();

  switch (true) {
    case !error.failedToGetCircuitDetailError && overview === undefined && guiData === undefined: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <Grid xs={1} ys={1} xfs={1} yfs={1} container style={{ borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <OverviewBar xs={1} error={error.failedToGetCircuitDetailError} overview={overview} />
            </Grid>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              grow={1}
              style={{ width: "100%", marginTop: 10 }}
            >
              <LoadingPuls />
            </Flex>
          </Flex>
        </LayoutContainer>
      );
    }
    case !error.failedToGetCircuitDetailError && overview !== undefined && guiData !== undefined: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <Grid xs={1} ys={1} xfs={1} yfs={1} container style={{ borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <OverviewBar xs={1} error={error.failedToGetCircuitDetailError} overview={overview} />
            </Grid>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              grow={1}
              style={{ width: "100%", marginTop: 10, background: "#222" }}
            >
              <CircuitDiagram data={guiData} />
            </Flex>
          </Flex>
        </LayoutContainer>
      );
    }
    case error.failedToGetCircuitDetailError: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <Grid xs={1} ys={1} xfs={1} yfs={1} container style={{ borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <OverviewBar xs={1} error={error.failedToGetCircuitDetailError} overview={overview} />
            </Grid>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              grow={1}
              style={{ width: "100%", marginTop: 10 }}
            >
              <Typography>Failed to get circuit detail</Typography>
            </Flex>
          </Flex>
        </LayoutContainer>
      );
    }
    default: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <Grid xs={1} ys={1} xfs={1} yfs={1} container style={{ borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <OverviewBar xs={1} error={error.failedToGetCircuitDetailError} overview={overview} />
            </Grid>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              grow={1}
              style={{ width: "100%", marginTop: 10 }}
            >
              <Typography>Something went wrong</Typography>
            </Flex>
          </Flex>
        </LayoutContainer>
      );
    }
  }
}
