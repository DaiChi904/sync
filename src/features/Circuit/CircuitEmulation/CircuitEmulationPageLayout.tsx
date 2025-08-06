import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEmulationPageHandlerContext } from "@/contexts/CircuitEmulationPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import EvalMenu from "./EvalMenu";
import OverviewBar from "./OverviewBar";

export default function CircuitEmulationPageLayout() {
  const { error, overview, guiData, currentPhase, entryInputs, outputs, updateEntryInputs, evalCircuit } =
    useCircuitEmulationPageHandlerContext();

  switch (true) {
    case !error.failedToGetCircuitDetailError && overview === undefined && guiData === undefined: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <OverviewBar error={error.failedToGetCircuitDetailError} overview={overview} />
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
            <OverviewBar error={error.failedToGetCircuitDetailError} overview={overview} />
            <Grid xs={1} ys={1} xfs={5} yfs={1} container grow={1}>
              <Grid
                xs={2}
                ys={1}
                xfs={5}
                yfs={1}
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <EvalMenu
                  error={{
                    failedToSetupEmulatorServiceError: error.failedToSetupEmulatorServiceError,
                    failedToEvalCircuitError: error.failedToEvalCircuitError,
                  }}
                  currentPhase={currentPhase}
                  entryInputs={entryInputs}
                  outputs={outputs}
                  updateEntryInputs={updateEntryInputs}
                  evalCircuit={evalCircuit}
                />
              </Grid>
              <Grid
                xs={3}
                ys={1}
                xfs={5}
                yfs={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: 10,
                  background: "#222",
                }}
              >
                <CircuitDiagram data={guiData} outputRecord={outputs} />
              </Grid>
            </Grid>
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
            <OverviewBar error={error.failedToGetCircuitDetailError} overview={overview} />
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
            <OverviewBar error={error.failedToGetCircuitDetailError} overview={overview} />
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
