import type { ComponentProps } from "react";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Pending from "@/components/atoms/Pending";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEditorPageHandlerContext } from "@/contexts/CircuitEditorPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import BaseCircuitPageLayout from "../common/BaseCircuitPageLayout";
import ElementSideBar from "./ElementSideBar";
import FormatSideBar from "./FormatSideBar";

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
    addEdgeWaypoint,
    deleteEdgeWaypoint,
    draggingWaypoint,
    handleWaypointMouseDown,
    handleWaypointMouseMove,
    handleWaypointMouseUp,
    uiState,
    openUtilityMenu,
    closeUtilityMenu,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  } = useCircuitEditorPageHandlerContext();

  const isInCriticalError =
    error.failedToGetCircuitDetailError || error.failedToParseCircuitDataError || error.failedToRenderCircuitError;

  const toolBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["toolBarOptions"] = [
    {
      label: "File",
      menuOptions: [
        {
          label: "Save",
          kind: "func",
          onClick: () => {
            save();
            closeToolBarMenu();
          },
        },
        { label: "Close Edit Page", kind: "link", href: `/circuit/${circuit?.id}` },
      ],
      isExpanded: uiState.toolBarMenu.open === "file",
      onClickExpand: () => openToolBarMenu("file"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "View",
      menuOptions: [],
      isExpanded: uiState.toolBarMenu.open === "view",
      onClickExpand: () => openToolBarMenu("view"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "Go to",
      menuOptions: [
        { label: "View", kind: "link", href: `/circuit/${circuit?.id}` },
        { label: "Emulation", kind: "link", href: `/circuit/${circuit?.id}/emulation` },
      ],
      isExpanded: uiState.toolBarMenu.open === "goTo",
      onClickExpand: () => openToolBarMenu("goTo"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "Help",
      menuOptions: [],
      isExpanded: uiState.toolBarMenu.open === "help",
      onClickExpand: () => openToolBarMenu("help"),
      onClickClose: () => closeToolBarMenu(),
    },
  ];
  const activityBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["activityBarOptions"] = [
    { label: "Information", onClick: () => changeActivityBarMenu("infomation") },
    { label: "Circuit Diagram", onClick: () => changeActivityBarMenu("circuitDiagram") },
    { label: "Row Circuit Data", onClick: () => changeActivityBarMenu("rowCircuitData") },
  ];

  return (
    <LayoutContainer>
      <BaseCircuitPageLayout toolBarOptions={toolBarOptions} activityBarOptions={activityBarOptions}>
        <Pending
          isLoading={(!circuit || !guiData) && !isInCriticalError}
          fallback={
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              grow={1}
              style={{ width: "100%", height: "100%" }}
            >
              <LoadingPuls />
            </Flex>
          }
          error={isInCriticalError}
          onFailure={<Typography>Something went wrong</Typography>}
        >
          {(() => {
            switch (uiState.activityBarMenu.open) {
              case "infomation":
                return (
                  <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    grow={1}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Typography>Not Implemented yet.</Typography>
                  </Flex>
                );
              case "circuitDiagram":
                return (
                  <Grid xfs={6} container grow={1}>
                    <Grid xs={1} grow={1}>
                      <ElementSideBar viewBox={viewBox} addCircuitNode={addCircuitNode} />
                    </Grid>
                    <Grid
                      ref={circuitDiagramContainer}
                      xs={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--color-bg)",
                      }}
                    >
                      <Flex
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        grow={1}
                        style={{ height: "100%", width: "100%", background: "var(--color-circuit-diagram-bg)" }}
                      >
                        <Pending isLoading={!viewBox}>
                          <CircuitDiagram
                            showTouchableArea
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
                            deleteCircuitNode={deleteCircuitNode}
                            deleteCircuitEdge={deleteCircuitEdge}
                            draggingNodePin={draggingNodePin}
                            handleNodePinMouseDown={handleNodePinMouseDown}
                            handleNodePinMouseMove={handleNodePinMouseMove}
                            handleNodePinMouseUp={handleNodePinMouseUp}
                            tempEdge={tempEdge}
                            addEdgeWaypoint={addEdgeWaypoint}
                            deleteEdgeWaypoint={deleteEdgeWaypoint}
                            draggingWaypoint={draggingWaypoint}
                            handleWaypointMouseDown={handleWaypointMouseDown}
                            handleWaypointMouseMove={handleWaypointMouseMove}
                            handleWaypointMouseUp={handleWaypointMouseUp}
                            uiState={uiState}
                            openUtilityMenu={openUtilityMenu}
                            closeUtilityMenu={closeUtilityMenu}
                          />
                        </Pending>
                      </Flex>
                    </Grid>
                    <Grid xs={1} grow={1}>
                      <FormatSideBar data={focusedElement} />
                    </Grid>
                  </Grid>
                );
              case "rowCircuitData":
                return (
                  <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    grow={1}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Typography>Not Implemented yet.</Typography>
                  </Flex>
                );
            }
          })()}
        </Pending>
      </BaseCircuitPageLayout>
    </LayoutContainer>
  );
}
