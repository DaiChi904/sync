import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { Coordinate } from "../valueObject/coordinate";

const brandSymbol = Symbol("CircuitGuiNode");

interface ICircuitGuiNode {
  id: CircuitNodeId;
  type: CircuitNodeType;
  inputs: Array<{ id: CircuitNodePinId; coordinate: Coordinate }>;
  outputs: Array<{ id: CircuitNodePinId; coordinate: Coordinate }>;
  coordinate: Coordinate;
  size: CircuitNodeSize;
}

export type CircuitGuiNode = Brand<ICircuitGuiNode, typeof brandSymbol>;

export namespace CircuitGuiNode {
  export const from = (value: ICircuitGuiNode): CircuitGuiNode => {
    return value as CircuitGuiNode;
  };

  export const unBrand = (value: CircuitGuiNode): ICircuitGuiNode => {
    return value as unknown as ICircuitGuiNode;
  };
}
