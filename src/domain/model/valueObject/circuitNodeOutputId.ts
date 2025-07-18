import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "./circuitNodeId";

const brandSymbol = Symbol("CircuitNodeOutputId");

export type CircuitNodeOutputId = Brand<CircuitNodeId, typeof brandSymbol>;

export namespace CircuitNodeOutputId {
  export const from = (value: CircuitNodeId): CircuitNodeOutputId => {
    return value as CircuitNodeOutputId;
  };

  export const unBrand = (value: CircuitNodeOutputId): CircuitNodeId => {
    return value as unknown as CircuitNodeId;
  };
}
