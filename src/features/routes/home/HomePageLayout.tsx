import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useHomePageControllerContext } from "@/contexts/HomePageControllerContext";
import CircuitOverviews from "./Overviews";

export default function HomePageLayout() {
  const { error, uiState, circuitOverviews, changeActivityBarMenu, addNewCircuit } = useHomePageControllerContext();

  return (
    <LayoutContainer>
      <Grid ys={12} xfs={12} container grow={1}>
        <Grid yfs={8} container grow={1}>
          <PrimaryButton
            variant="text"
            animation="slide"
            style={{ border: "none", fontWeight: "bold" }}
            onClick={() => changeActivityBarMenu("home")}
          >
            Home
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            animation="slide"
            style={{ border: "none", fontWeight: "bold" }}
            onClick={() => changeActivityBarMenu("new")}
          >
            New
          </PrimaryButton>
        </Grid>
        <Grid xs={11} grow={1}>
          {(() => {
            switch (uiState.tab.open) {
              case "home":
                return (
                  <CircuitOverviews
                    overviews={circuitOverviews}
                    error={error.hasError("failedToGetCircuitOverviewsError")}
                  />
                );
              case "new":
                return (
                  <Flex direction="column" style={{ padding: 10, width: "100%", height: "100%" }}>
                    <PrimaryButton
                      variant="outlined"
                      animation="push"
                      style={{ width: "20%", height: "400px", borderRadius: "5px" }}
                      onClick={() => addNewCircuit("empty")}
                    >
                      <Typography size="large">Start with empty data.</Typography>
                    </PrimaryButton>
                  </Flex>
                );
            }
          })()}
        </Grid>
      </Grid>
    </LayoutContainer>
  );
}
