import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Pending from "@/components/atoms/Pending";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEditorPageHandlerContext } from "@/contexts/CircuitEditorPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import ElementSideBar from "./ElementSideBar";
import FormatSideBar from "./FormatSideBar";
import Toolbar from "./Toolbar";

export default function CircuitEditorPageLayout() {
  const {
    error,
    circuit,
    guiData,
    viewBox,
    isPanningRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    preventBrowserZoom,
    save,
    addCircuitNode,
    updateCircuitNode,
    deleteCircuitNode,
    addCircuitEdge,
    updateCircuitEdge,
    deleteCircuitEdge,
    circuitDiagramContainer,
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
    openUtilityMenu,
    closeUtilityMenu,
    openToolbarMenu,
    closeToolbarMenu,
  } = useCircuitEditorPageHandlerContext();

  return (
    <LayoutContainer>
      <Flex
        direction="column"
        grow={1}
        style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
      >
        <Toolbar
          circuit={circuit}
          open={uiState.toolbarMenu.open}
          onClickExpand={openToolbarMenu}
          onClickClose={closeToolbarMenu}
          fileMenuOptions={[
            {
              label: "Save",
              kind: "func",
              onClick: () => {
                save();
                closeToolbarMenu();
              },
              disabled: !circuit,
            },
            { label: "Chamge Name", kind: "func", onClick: () => {}, disabled: !circuit },
            { label: "Export", kind: "func", onClick: () => {}, disabled: !circuit },
            { label: "Back", kind: "link", href: circuit ? `/circuit/${circuit.id}` : "/" },
          ]}
          viewMenuOptions={[]}
          helpMenuOptions={[]}
        />
        <Flex
          direction="column"
          grow={1}
          style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
        >
          <Grid xs={1} ys={1} xfs={6} yfs={1} container grow={1}>
            <Grid xs={1} ys={1} xfs={1} yfs={1} grow={1}>
              <ElementSideBar />
            </Grid>
            <Grid
              xs={4}
              ys={1}
              xfs={1}
              yfs={1}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                background: "#fff",
              }}
              ref={circuitDiagramContainer}
            >
              <Pending
                fallback={<LoadingPuls />}
                isLoading={!guiData}
                error={
                  error.failedToGetCircuitDetailError ||
                  error.failedToParseCircuitDataError ||
                  error.failedToRenderCircuitError ||
                  error.failedToUpdateCircuitDataError
                }
                onFailure={<Typography>Something went wrong</Typography>}
              >
                <CircuitDiagram
                  showTouchableArea={true}
                  // biome-ignore lint/style/noNonNullAssertion: guiData is guaranteed to be present when isLoading is false
                  data={guiData!}
                  svgRef={svgRef}
                  viewBox={viewBox}
                  isPanningRef={isPanningRef}
                  handleMouseDown={handleMouseDown}
                  handleMouseMove={handleMouseMove}
                  handleMouseUp={handleMouseUp}
                  handleWheel={handleWheel}
                  preventBrowserZoom={preventBrowserZoom}
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
                  openUtilityMenu={openUtilityMenu}
                  closeUtilityMenu={closeUtilityMenu}
                />
              </Pending>
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1} grow={1}>
              <FormatSideBar data={focusedElement} />
            </Grid>
          </Grid>
        </Flex>
      </Flex>
    </LayoutContainer>
  );
}
