import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { Coordinate } from "../valueObject/coordinate";

const brandSymbol = Symbol("CircuitNode");

interface ICircuitNode {
  id: CircuitNodeId;
  type: CircuitNodeType;
  inputs: Array<CircuitNodePinId>;
  outputs: Array<CircuitNodePinId>;
  coordinate: Coordinate;
  size: CircuitNodeSize;
}

export type CircuitNode = Brand<ICircuitNode, typeof brandSymbol>;

export namespace CircuitNode {
  export const from = (value: ICircuitNode): CircuitNode => {
    return value as CircuitNode;
  };

  export const unBrand = (value: CircuitNode): ICircuitNode => {
    return value as unknown as ICircuitNode;
  };
}
