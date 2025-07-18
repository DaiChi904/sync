import type { Brand } from "@/utils/brand";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { Coordinate } from "../valueObject/coordinate";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";

const brandSymbol = Symbol("CircuitGuiEdge");

interface ICircuitGuiEdge {
  id: CircuitEdgeId;
  from: CircuitNodePinId;
  to: CircuitNodePinId;
  waypoints: Array<Coordinate>;
}

export type CircuitGuiEdge = Brand<ICircuitGuiEdge, typeof brandSymbol>;

export namespace CircuitGuiEdge {
  export const from = (value: ICircuitGuiEdge): CircuitGuiEdge => {
    return value as CircuitGuiEdge;
  };

  export const unBrand = (value: CircuitGuiEdge): ICircuitGuiEdge => {
    return value as unknown as ICircuitGuiEdge;
  };
}
