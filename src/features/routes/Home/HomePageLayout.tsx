import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import Grid from "@/components/atoms/Grid";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useHomePageHandlerContext } from "@/contexts/HomePageHandlerContext";
import CircuitList from "./CircuitList";

export default function HomePageLayout() {
  const { error, circuitOverviews } = useHomePageHandlerContext();

  return (
    <LayoutContainer>
      <Grid ys={12} xfs={12} container grow={1}>
        <Grid yfs={8} container grow={1}>
          <PrimaryButton variant="text" animation="slide" style={{ border: "none", fontWeight: "bold" }}>
            Home
          </PrimaryButton>
          <PrimaryButton variant="text" animation="slide" style={{ border: "none", fontWeight: "bold" }}>
            New
          </PrimaryButton>
        </Grid>
        <Grid xs={11} grow={1}>
          <CircuitList circuitList={circuitOverviews} error={error.failedToGetCircuitOverviewsError} />
        </Grid>
      </Grid>
    </LayoutContainer>
  );
}
