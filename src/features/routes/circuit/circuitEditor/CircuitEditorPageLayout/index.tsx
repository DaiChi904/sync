import type { ComponentProps } from "react";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitEditorPageControllerContext } from "@/contexts/CircuitEditorPageControllerContext";
import BaseCircuitPageLayout from "../../common/BaseCircuitPageLayout";
import CircuitDiagramPanel from "./contents/CircuitDiagramPanel";
import CircuitInfoPanel from "./contents/CircuitInfoPanel";
import RawDataPanel from "./contents/RawDataPanel";

export default function CircuitEditorPageLayout() {
  const {
    error,
    circuit,
    guiData,
    viewBox,
    panningRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
    save,
    deleteCircuit,
    changeTitle,
    changeDescription,
    addCircuitNode,
    createCircuitNode,
    deleteCircuitNode,
    deleteCircuitEdge,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
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
  } = useCircuitEditorPageControllerContext();

  const isInCriticalError =
    error.hasError("failedToGetCircuitDetailError") ||
    error.hasError("failedToParseCircuitDataError") ||
    error.hasError("failedToRenderCircuitError");

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
        {
          label: "Delete",
          kind: "func",
          onClick: () => {
            deleteCircuit();
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

  const renderContent = () => {
    switch (uiState.activityBarMenu.open) {
      case "infomation":
        return (
          <CircuitInfoPanel
            circuit={circuit}
            isLoading={!circuit}
            isError={isInCriticalError}
            changeTitle={changeTitle}
            changeDescription={changeDescription}
          />
        );
      case "circuitDiagram":
        return (
          <CircuitDiagramPanel
            guiData={guiData}
            isLoading={!guiData}
            isError={isInCriticalError}
            viewBox={viewBox}
            panningRef={panningRef}
            circuitDiagramContainerRef={circuitDiagramContainerRef}
            circuitDiagramSvgRef={circuitDiagramSvgRef}
            handleViewBoxMouseDown={handleViewBoxMouseDown}
            handleViewBoxMouseMove={handleViewBoxMouseMove}
            handleViewBoxMouseUp={handleViewBoxMouseUp}
            handleViewBoxZoom={handleViewBoxZoom}
            preventBrowserZoom={preventBrowserZoom}
            addCircuitNode={addCircuitNode}
            createCircuitNode={createCircuitNode}
            focusedElement={focusedElement}
            focusElement={focusElement}
            draggingNode={draggingNode}
            handleNodeMouseDown={handleNodeMouseDown}
            handleNodeMouseMove={handleNodeMouseMove}
            handleNodeMouseUp={handleNodeMouseUp}
            deleteCircuitNode={deleteCircuitNode}
            draggingNodePin={draggingNodePin}
            handleNodePinMouseDown={handleNodePinMouseDown}
            handleNodePinMouseMove={handleNodePinMouseMove}
            handleNodePinMouseUp={handleNodePinMouseUp}
            tempEdge={tempEdge}
            deleteCircuitEdge={deleteCircuitEdge}
            addEdgeWaypoint={addEdgeWaypoint}
            deleteEdgeWaypoint={deleteEdgeWaypoint}
            draggingWaypoint={draggingWaypoint}
            handleWaypointMouseDown={handleWaypointMouseDown}
            handleWaypointMouseMove={handleWaypointMouseMove}
            handleWaypointMouseUp={handleWaypointMouseUp}
            diagramUtilityMenu={uiState.diagramUtilityMenu}
            openUtilityMenu={openUtilityMenu}
            closeUtilityMenu={closeUtilityMenu}
          />
        );
      case "rowCircuitData":
        return <RawDataPanel />;
    }
  };

  return (
    <LayoutContainer>
      <BaseCircuitPageLayout toolBarOptions={toolBarOptions} activityBarOptions={activityBarOptions}>
        {renderContent()}
      </BaseCircuitPageLayout>
    </LayoutContainer>
  );
}
