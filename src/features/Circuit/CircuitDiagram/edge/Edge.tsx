import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";

interface EdgeProps {
  edge: CircuitGuiEdge;
  pinMap: Map<CircuitNodePinId, Coordinate>;
  waypointsMap: Map<CircuitNodePinId, Coordinate[]>;
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

  const waypoints =
    JSON.stringify(waypointsMap.get(edge.from)) === JSON.stringify(waypointsMap.get(edge.to))
      ? waypointsMap.get(edge.from)
      : [];

  const edges = [from, ...(waypoints ?? []), to].map((point) => {
    return point;
  });

  return edges.map((from, idx) => {
    if (idx === edges.length - 1) return null;
    const to = edges[idx + 1];
    return (
      <>
        <defs>
          {/** biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
          <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#00a120" />
          </marker>
        </defs>

        <g key={`${edge.id}-${idx}`}>
          <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={outputMap?.get(edge.from) === true ? "#00a120" : "#9ca19d"}
            strokeWidth={2}
            markerEnd={isInFocus ? "url(#arrow)" : "none"}
          />
          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support. */}
          <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(0,0,0,0)"
            strokeWidth={30}
            onClick={() => focusElement?.({ ...edge, waypointIdx: idx })}
            onContextMenu={(ev) => {
              focusElement?.({ ...edge, waypointIdx: idx });
              openEdgeUtilityMenu?.(ev);
            }}
          />
          <circle cx={from.x} cy={from.y} r={0.5} fill="#00a120" pointerEvents="all" stroke="#00a120" />

          {isInFocus && (
            <>
              {/** When manipulating edges that are connected on both sides, it is more intuitive to reverse the kind, so we will reverse it. */}
              {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
              <circle
                cx={from.x}
                cy={from.y}
                r={15}
                fill="rgba(0,0,0,0)"
                pointerEvents="all"
                stroke="#fff"
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
              {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
              <circle
                cx={to.x}
                cy={to.y}
                r={15}
                fill="rgba(0,0,0,0)"
                pointerEvents="all"
                stroke="#fff"
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
        </g>
      </>
    );
  });
}
