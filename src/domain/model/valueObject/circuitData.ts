import type { Brand } from "@/utils/brand";
import type { CircuitEdgeId } from "./circuitEdgeId";
import type { CircuitNodeId } from "./circuitNodeId";
import type { CircuitNodePinId } from "./circuitNodePinId";
import type { CircuitNodeSize } from "./circuitNodeSize";
import type { CircuitNodeType } from "./circuitNodeType";
import type { Coordinate } from "./coordinate";
import type { Waypoint } from "./waypoint";

const brandSymbol = Symbol("CircuitData");

interface ICircuitData {
  nodes: Array<{
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: Array<CircuitNodePinId>;
    outputs: Array<CircuitNodePinId>;
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }>;
  edges: Array<{
    id: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Waypoint | null;
  }>;
}

export type CircuitData = Brand<ICircuitData, typeof brandSymbol>;

export namespace CircuitData {
  export const from = (value: ICircuitData): CircuitData => {
    return value as CircuitData;
  };

  export const unBrand = (value: CircuitData): ICircuitData => {
    return value as unknown as ICircuitData;
  };
}
