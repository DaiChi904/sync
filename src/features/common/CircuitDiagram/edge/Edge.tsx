import { SvgCircle, SvgDefs, SvgGroup, SvgLine, SvgMarker, SvgPath } from "@/components/atoms/svg";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";

interface EdgeProps {
  edge: CircuitGuiEdge;
  pinMap: Map<CircuitNodePinId, Coordinate>;
  waypointsMap: Map<CircuitEdgeId, Coordinate[] | undefined>;
  outputMap?: Map<CircuitNodePinId, EvalResult>;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleWaypointMouseDown?: (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  openEdgeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function Edge({
  edge,
  pinMap,
  waypointsMap,
  outputMap,
  isInFocus,
  focusElement,
  handleNodePinMouseDown,
  handleWaypointMouseDown,
  openEdgeUtilityMenu,
}: EdgeProps) {
  const from = pinMap.get(edge.from);
  const to = pinMap.get(edge.to);
  if (!from || !to) return null;

  const waypoints = waypointsMap.get(edge.id);
  const edges = [from, ...(waypoints ?? []), to].map((point) => {
    return point;
  });

  return edges.map((from, idx) => {
    if (idx === edges.length - 1) return null;
    const to = edges[idx + 1];
    return (
      <>
        <SvgDefs>
          {/** biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
          <SvgMarker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <SvgPath d="M 0 0 L 5 2.5 L 0 5 z" fill="var(--color-circuit-state-high)" />
          </SvgMarker>
        </SvgDefs>

        <SvgGroup key={`${edge.id}-${idx}`}>
          <SvgLine
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={
              outputMap?.get(edge.from) === true ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)"
            }
            strokeWidth={2}
            markerEnd={isInFocus ? "url(#arrow)" : "none"}
          />
          <SvgLine
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="transparent"
            strokeWidth={30}
            onClick={() => focusElement?.({ ...edge, waypointIdx: idx })}
            onContextMenu={(ev) => {
              focusElement?.({ ...edge, waypointIdx: idx });
              openEdgeUtilityMenu?.(ev);
            }}
          />
          <SvgCircle
            cx={from.x}
            cy={from.y}
            r={0.5}
            pointerEvents="all"
            fill={
              outputMap?.get(edge.from) === true ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)"
            }
            stroke={
              outputMap?.get(edge.from) === true ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)"
            }
          />

          {isInFocus && (
            <>
              {/** When manipulating edges that are connected on both sides, it is more intuitive to reverse the kind, so we will reverse it. */}
              <SvgCircle
                cx={from.x}
                cy={from.y}
                r={15}
                fill="transparent"
                pointerEvents="all"
                stroke="var(--color-white)"
                strokeWidth={1}
                onContextMenu={openEdgeUtilityMenu}
                onMouseDown={
                  idx === 0 || edges.length < 2
                    ? (ev) => {
                        handleNodePinMouseDown?.(ev, edge.to, "to", "UPDATE");
                      }
                    : handleWaypointMouseDown?.(from, idx - 1)
                }
              />
              <SvgCircle
                cx={to.x}
                cy={to.y}
                r={15}
                fill="transparent"
                pointerEvents="all"
                stroke="var(--color-white)"
                strokeWidth={1}
                onContextMenu={openEdgeUtilityMenu}
                onMouseDown={
                  idx + 1 === edges.length - 1 || edges.length < 2
                    ? (ev) => handleNodePinMouseDown?.(ev, edge.from, "from", "UPDATE")
                    : undefined
                }
              />
            </>
          )}
        </SvgGroup>
      </>
    );
  });
}
