import type { ComponentProps } from "react";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Pending from "@/components/atoms/Pending";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEmulationPageHandlerContext } from "@/contexts/CircuitEmulationPageHandlerContext";
import CircuitDiagram from "../CircuitDiagram";
import BaseCircuitPageLayout from "../common/BaseCircuitPageLayout";
import EvalMenu from "./EvalMenu";

export default function CircuitEmulationPageLayout() {
  const {
    error,
    overview,
    guiData,
    currentPhase,
    entryInputs,
    outputs,
    updateEntryInputs,
    evalCircuit,
    uiState,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  } = useCircuitEmulationPageHandlerContext();

  const isInCriticalError = error.failedToGetCircuitDetailError || error.failedToGenGuiCircuitDataError;

  const toolBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["toolBarOptions"] = [
    {
      label: "File",
      menuOptions: [{ label: "Close Emulation Page", kind: "link", href: `/circuit/${overview?.id}` }],
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
        { label: "View", kind: "link", href: `/circuit/${overview?.id}` },
        { label: "Edit", kind: "link", href: `/circuit/${overview?.id}/edit` },
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
        <Pending
          isLoading={!overview || (!guiData && isInCriticalError)}
          fallback={<LoadingPuls />}
          error={isInCriticalError}
          onFailure={<Typography>Failed to load circuit data.</Typography>}
        >
          <Grid xfs={5} container grow={1}>
            <Grid xs={2} xfs={5}>
              {uiState.activityBarMenu.open === "evalMenu" && (
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
              )}
            </Grid>
            <Grid xs={3} xfs={5} grow={1}>
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                grow={1}
                style={{ height: "100%", width: "100%", background: "var(--color-circuit-diagram-bg)" }}
              >
                <CircuitDiagram
                  // biome-ignore lint/style/noNonNullAssertion: guiData is guaranteed to be present when isLoading is false
                  data={guiData!}
                  outputRecord={outputs}
                />
              </Flex>
            </Grid>
          </Grid>
        </Pending>
      </BaseCircuitPageLayout>
    </LayoutContainer>
  );
}
