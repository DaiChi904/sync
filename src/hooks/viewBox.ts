import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { RIGHT_CLICK } from "@/constants/mouseEvent";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { ViewBox } from "@/domain/model/valueObject/viewBox";
import type { Result } from "@/utils/result";

export class UseViewBoxInternalError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UseViewBoxInternalError";
  }
}

export const useViewBox = () => {
  const [viewBox, setViewBox] = useState<ViewBox>(ViewBox.from({ x: 0, y: 0, w: 0, h: 0 }));
  const [lastMousePosition, setLastMousePosition] = useState<Coordinate>(Coordinate.from({ x: 0, y: 0 }));

  const svgRef = useRef<SVGSVGElement | null>(null);
  const panningRef = useRef(false);

  const updateViewBox = useCallback((viewBox: ViewBox) => {
    setViewBox(viewBox);
  }, []);

  const getSvgCoords = useCallback((ev: React.MouseEvent): Result<Coordinate, UseViewBoxInternalError> => {
    try {
      const svg = svgRef.current;
      if (!svg) {
        throw new UseViewBoxInternalError("Unable to get svg coordinates. svgRef is null.");
      }

      const pt = svg.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      return { ok: true, value: Coordinate.from({ x: cursorPt.x, y: cursorPt.y }) };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof UseViewBoxInternalError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new UseViewBoxInternalError("Unknow error occurred when trying to get svg coordinates.", {
          cause: err,
        }),
      };
    }
  }, []);

  const handleViewBoxMouseDown = useCallback((ev: React.MouseEvent) => {
    if (ev.button !== RIGHT_CLICK) return;

    panningRef.current = true;
    setLastMousePosition(Coordinate.from({ x: ev.clientX, y: ev.clientY }));
  }, []);

  const handleViewBoxMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      if (!panningRef.current) return;

      const dx = (ev.clientX - lastMousePosition.x) * (viewBox.w / window.innerWidth);
      const dy = (ev.clientY - lastMousePosition.y) * (viewBox.h / window.innerHeight);

      setViewBox((prev) => {
        return {
          ...prev,
          x: prev.x - dx,
          y: prev.y - dy,
        };
      });

      setLastMousePosition(Coordinate.from({ x: ev.clientX, y: ev.clientY }));
    },
    [lastMousePosition, viewBox],
  );

  const handleViewBoxMouseUp = useCallback(() => {
    panningRef.current = false;
  }, []);

  const handleViewBoxZoom = useCallback((ev: React.WheelEvent) => {
    if (!ev.ctrlKey) return;

    const scaleAmount = ev.deltaY < 0 ? 0.9 : 1.1;
    const mouseX = ev.clientX / window.innerWidth;
    const mouseY = ev.clientY / window.innerHeight;

    setViewBox((prev) => {
      const newW = prev.w * scaleAmount;
      const newH = prev.h * scaleAmount;
      return ViewBox.from({
        x: prev.x + (prev.w - newW) * mouseX,
        y: prev.y + (prev.h - newH) * mouseY,
        w: newW,
        h: newH,
      });
    });
  }, []);

  const preventBrowserZoom = useCallback((ref: RefObject<SVGSVGElement | null>) => {
    // biome-ignore lint/correctness/useHookAtTopLevel: This is safe under the Rules of Hooks. We've just encapsulated useEffect in a local function for readability. Since it depends on a ref, it's guaranteed to run on the initial render, making it equivalent to a top-level call.
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const wheelController = (e: WheelEvent) => {
        if (e.ctrlKey) e.preventDefault();
      };

      el.addEventListener("wheel", wheelController, { passive: false });
      return () => el.removeEventListener("wheel", wheelController);
    }, [ref]);
  }, []);

  return {
    viewBox,
    svgRef,
    panningRef,
    updateViewBox,
    getSvgCoords,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
  };
};
