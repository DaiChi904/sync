import type { ComponentProps } from "react";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import { SafePending } from "@/components/atoms/utils/SafePending";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEmulationPageControllerContext } from "@/contexts/CircuitEmulationPageControllerContext";
import CircuitDiagram from "../../../common/circuitDiagram";
import BaseCircuitPageLayout from "../common/BaseCircuitPageLayout";
import EvalMenu from "./EvalMenu";

export default function CircuitEmulationPageLayout() {
  const {
    error,
    uiState,
    circuit,
    guiData,
    currentTick,
    evalDuration,
    entryInputs,
    outputs,
    viewBox,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    panningRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
    updateEntryInputs,
    evalCircuit,
    changeEvalDuration,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  } = useCircuitEmulationPageControllerContext();

  const toolBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["toolBarOptions"] = [
    {
      label: "File",
      menuOptions: [{ label: "Close Emulation Page", kind: "link", href: `/circuit/${circuit?.id}` }],
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
        { label: "Edit", kind: "link", href: `/circuit/${circuit?.id}/edit` },
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
    { label: "Eval Menu", onClick: () => changeActivityBarMenu("evalMenu") },
  ];

  return (
    <LayoutContainer>
      <BaseCircuitPageLayout toolBarOptions={toolBarOptions} activityBarOptions={activityBarOptions}>
        <Grid xfs={5} container grow={1}>
          <Grid xs={2} xfs={5}>
            {(() => {
              switch (uiState.activityBarMenu.open) {
                case "evalMenu": {
                  return (
                    <EvalMenu
                      error={error}
                      currentTick={currentTick}
                      evalDuration={evalDuration}
                      entryInputs={entryInputs}
                      outputs={outputs}
                      updateEntryInputs={updateEntryInputs}
                      evalCircuit={evalCircuit}
                      changeEvalDuration={changeEvalDuration}
                    />
                  );
                }
              }
            })()}
          </Grid>
          <Grid xs={3} xfs={5} grow={1}>
            <SafePending
              data={guiData}
              isLoading={!guiData}
              isError={error.hasError("guiRenderError")}
              fallback={{
                onLoading: () => <LoadingPuls />,
                onError: () => <Typography>Failed to load circuit data.</Typography>,
              }}
            >
              {(guiData) => (
                <CircuitDiagram
                  data={{
                    guiData,
                    outputRecord: outputs,
                  }}
                  viewBox={{
                    viewBox,
                    panningRef,
                    circuitDiagramContainerRef,
                    circuitDiagramSvgRef,
                    handleViewBoxMouseDown,
                    handleViewBoxMouseMove,
                    handleViewBoxMouseUp,
                    handleViewBoxZoom,
                    preventBrowserZoom,
                  }}
                />
              )}
            </SafePending>
          </Grid>
        </Grid>
      </BaseCircuitPageLayout>
    </LayoutContainer>
  );
}
