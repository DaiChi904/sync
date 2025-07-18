import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "./circuitNodeId";

const brandSymbol = Symbol("CircuitEdge");

interface ICircuitEdge {
  from: CircuitNodeId;
  to: CircuitNodeId;
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
