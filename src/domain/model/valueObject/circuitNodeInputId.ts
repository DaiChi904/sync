import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "./circuitNodeId";

const brandSymbol = Symbol("CircuitNodeInputId");

export type CircuitNodeInputId = Brand<CircuitNodeId, typeof brandSymbol>;

export namespace CircuitNodeInputId {
  export const from = (value: CircuitNodeId): CircuitNodeInputId => {
    return value as CircuitNodeInputId;
  };

  export const unBrand = (value: CircuitNodeInputId): CircuitNodeId => {
    return value as unknown as CircuitNodeId;
  };
}
