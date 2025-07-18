import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodeInputId } from "../valueObject/circuitNodeInputId";
import type { CircuitNodeOutputId } from "../valueObject/circuitNodeOutputId";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";

const brandSymbol = Symbol("CircuitGraphNode");

interface ICircuitGraphNode {
  id: CircuitNodeId;
  type: CircuitNodeType;
  inputs: CircuitNodeInputId[];
  outputs: CircuitNodeOutputId[];
}

export type CircuitGraphNode = Brand<ICircuitGraphNode, typeof brandSymbol>;

export namespace CircuitGraphNode {
  export const from = (value: ICircuitGraphNode): CircuitGraphNode => {
    return value as CircuitGraphNode;
  };

  export const unBrand = (value: CircuitGraphNode): ICircuitGraphNode => {
    return value as unknown as ICircuitGraphNode;
  };
}
