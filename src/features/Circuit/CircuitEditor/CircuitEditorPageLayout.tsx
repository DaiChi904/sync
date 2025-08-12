import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEditorPageHandlerContext } from "@/contexts/CircuitEditorPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import CircuitEditor from "./EditorMenu";
import OverviewBar from "./OverviewBar";

export default function CircuitEditorPageLayout() {
  const {
    error,
    circuit,
    guiData,
    save,
    addCircuitNode,
    updateCircuitNode,
    deleteCircuitNode,
    addCircuitEdge,
    updateCircuitEdge,
    deleteCircuitEdge,
    svgRef,
    focusedElement,
    focusElement,
    draggingNode,
    handleNodeMouseDown,
    handleNodeMouseMove,
    handleNodeMouseUp,
    draggingNodePin,
    handleNodePinMouseDown,
    handleNodePinMouseMove,
    handleNodePinMouseUp,
    tempEdge,
    uiState,
    openEdgeUtilityMenu,
    closeEdgeUtilityMenu,
    openNodeUtilityMenu,
    closeNodeUtilityMenu,
  } = useCircuitEditorPageHandlerContext();

  switch (true) {
    case !error.failedToGetCircuitDetailError && circuit === undefined && guiData === undefined: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <OverviewBar error={error.failedToGetCircuitDetailError} circuit={circuit} />
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
    case !error.failedToGetCircuitDetailError && circuit !== undefined && guiData !== undefined: {
      return (
        <LayoutContainer>
          <Flex
            direction="column"
            grow={1}
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
          >
            <OverviewBar error={error.failedToGetCircuitDetailError} circuit={circuit} />
            <Flex
              direction="column"
              grow={1}
              style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
            >
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
                  <CircuitEditor
                    circuitEditorData={circuit.circuitData}
                    save={save}
                    addCircuitNode={addCircuitNode}
                    updateCircuitNode={updateCircuitNode}
                    deleteCircuitNode={deleteCircuitNode}
                    addCircuitEdge={addCircuitEdge}
                    updateCircuitEdge={updateCircuitEdge}
                    deleteCircuitEdge={deleteCircuitEdge}
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
                  <CircuitDiagram
                    data={guiData}
                    svgRef={svgRef}
                    focusedElement={focusedElement}
                    focusElement={focusElement}
                    draggingNode={draggingNode}
                    handleNodeMouseDown={handleNodeMouseDown}
                    handleNodeMouseMove={handleNodeMouseMove}
                    handleNodeMouseUp={handleNodeMouseUp}
                    draggingNodePin={draggingNodePin}
                    handleNodePinMouseDown={handleNodePinMouseDown}
                    handleNodePinMouseMove={handleNodePinMouseMove}
                    handleNodePinMouseUp={handleNodePinMouseUp}
                    tempEdge={tempEdge}
                    uiState={uiState}
                    openEdgeUtilityMenu={openEdgeUtilityMenu}
                    closeEdgeUtilityMenu={closeEdgeUtilityMenu}
                    openNodeUtilityMenu={openNodeUtilityMenu}
                    closeNodeUtilityMenu={closeNodeUtilityMenu}
                  />
                </Grid>
              </Grid>
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
            <OverviewBar error={error.failedToGetCircuitDetailError} circuit={circuit} />
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
            <OverviewBar error={error.failedToGetCircuitDetailError} circuit={circuit} />
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
