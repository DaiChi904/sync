import { useCallback, useRef, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import { ViewBox } from "@/domain/model/valueObject/viewBox";
import type { useViewBox } from "./viewBox";

export const useCircuitDiagram = (viewBoxApi: ReturnType<typeof useViewBox>) => {
  const circuitDiagramContainer = useRef<HTMLDivElement | null>(null);

  const [isViewBoxInitialized, setIsViewBoxInitialized] = useState<boolean>(false);

  const initViewBox = useCallback(
    (guiData: CircuitGuiData) => {
      if (isViewBoxInitialized || !circuitDiagramContainer.current) return;

      const MARRGIN = 20;
      
      const hasNodes = guiData.nodes.length > 0;
      const minX = hasNodes
        ? Math.min(...guiData.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN
        : 0;
      const minY = hasNodes
        ? Math.min(...guiData.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN
        : 0;
      const maxX = hasNodes
        ? Math.max(...guiData.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN
        : 0;
      const maxY = hasNodes
        ? Math.max(...guiData.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN
        : 0;
      const viewWidth = circuitDiagramContainer.current.clientWidth;
      const viewHeight = circuitDiagramContainer.current.clientHeight;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      viewBoxApi.updateViewBox(
        ViewBox.from({ x: centerX - viewWidth / 2, y: centerY - viewHeight / 2, w: viewWidth, h: viewHeight }),
      );

      setIsViewBoxInitialized(true);
    },
    [viewBoxApi, isViewBoxInitialized],
  );

  return {
    isViewBoxInitialized,
    viewBox: viewBoxApi.viewBox,
    circuitDiagramContainer,
    svgRef: viewBoxApi.svgRef,
    panningRef: viewBoxApi.panningRef,
    initViewBox,
    getSvgCoords: viewBoxApi.getSvgCoords,
    handleViewBoxMouseDown: viewBoxApi.handleViewBoxMouseDown,
    handleViewBoxMouseMove: viewBoxApi.handleViewBoxMouseMove,
    handleViewBoxMouseUp: viewBoxApi.handleViewBoxMouseUp,
    handleViewBoxZoom: viewBoxApi.handleViewBoxZoom,
    preventBrowserZoom: viewBoxApi.preventBrowserZoom,
  };
};
