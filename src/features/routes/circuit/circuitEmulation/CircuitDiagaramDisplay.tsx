import type { CircuitDiagramDataProps, ViewBoxHandlers } from "@/domain/model/controller/common/circuitDiagramProps";
import CircuitDiagram from "@/features/common/circuitDiagram";

interface CircuitDiagramDisplayProps {
  data: CircuitDiagramDataProps;
  viewBoxHandlers: ViewBoxHandlers;
}

export default function CircuitDiagramDisplay({ data, viewBoxHandlers }: CircuitDiagramDisplayProps) {
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
      data={data}
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
