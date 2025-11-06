import type { Brand } from "@/utils/brand";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { Waypoint } from "../valueObject/waypoint";

const brandSymbol = Symbol("CircuitEdge");

interface ICircuitEdge {
  id: CircuitEdgeId;
  from: CircuitNodePinId;
  to: CircuitNodePinId;
  waypoints: Waypoint | null;
}

export type CircuitEdge = Brand<ICircuitEdge, typeof brandSymbol>;

export namespace CircuitEdge {
  export const from = (value: ICircuitEdge): CircuitEdge => {
    return value as CircuitEdge;
  };

  export const unBrand = (value: CircuitEdge): ICircuitEdge => {
    return value as unknown as ICircuitEdge;
  };
}
