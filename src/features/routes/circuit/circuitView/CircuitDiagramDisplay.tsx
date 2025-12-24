import type { CircuitDiagramDataProps, ViewBoxHandlers } from "@/domain/model/controller/common/circuitDiagramProps";
import CircuitDiagram from "@/features/common/circuitDiagram";

interface CircuitDiagramDisplayProps {
  guiData: CircuitDiagramDataProps["guiData"];
  viewBoxHandlers: ViewBoxHandlers;
}

export default function CircuitDiagramDisplay({ guiData, viewBoxHandlers }: CircuitDiagramDisplayProps) {
  const {
    viewBox,
    panningRef,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
  } = viewBoxHandlers;
  return (
    <CircuitDiagram
      data={{
        guiData,
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
  );
}
