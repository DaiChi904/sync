import Button from "@/components/atoms/Button";
import Grid from "@/components/atoms/Grid";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useHomePageHandlerContext } from "@/contexts/HomePageHandlerContext";
import CircuitList from "./CircuitList";

export default function HomePageLayout() {
  const { error, circuitOverviews } = useHomePageHandlerContext();

  return (
    <LayoutContainer>
      <Grid xs={1} ys={12} xfs={12} yfs={1} container grow={1}>
        <Grid xs={1} ys={1} xfs={1} yfs={8} container grow={1}>
          <Button>Home</Button>
          <Button>New</Button>
        </Grid>
        <Grid xs={11} ys={1} xfs={1} yfs={1} grow={1}>
          <CircuitList circuitList={circuitOverviews} error={error.failedToGetCircuitOverviewsError} />
        </Grid>
      </Grid>
    </LayoutContainer>
  );
}
