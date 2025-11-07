import type { Brand } from "@/utils/brand";
import type { CircuitGuiEdge } from "../entity/circuitGuiEdge";
import type { CircuitGuiNode } from "../entity/circuitGuiNode";

const brandSymbol = Symbol("CircuitGuiData");

interface ICircuitGuiData {
  nodes: Array<CircuitGuiNode>;
  edges: Array<CircuitGuiEdge>;
}

export type CircuitGuiData = Brand<ICircuitGuiData, typeof brandSymbol>;

export namespace CircuitGuiData {
  export const from = (value: ICircuitGuiData): CircuitGuiData => {
    return value as CircuitGuiData;
  };

  export const unBrand = (value: CircuitGuiData): ICircuitGuiData => {
    return value as unknown as ICircuitGuiData;
  };
}
