import type { Brand } from "@/utils/brand";
import type { CircuitGraphNode } from "../entity/circuitGraphNode";

const brandSymbol = Symbol("CircuitGraphData");

export type CircuitGraphData = Brand<Array<CircuitGraphNode>, typeof brandSymbol>;

export namespace CircuitGraphData {
  export const from = (value: Array<CircuitGraphNode>): CircuitGraphData => {
    return value as CircuitGraphData;
  };

  export const unBrand = (value: CircuitGraphData): Array<CircuitGraphNode> => {
    return value as unknown as Array<CircuitGraphNode>;
  };
}
