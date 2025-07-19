import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { EvalHistory } from "../valueObject/evalHistory";
import type { ExecutionOrder } from "../valueObject/executionOrder";
import type { Phase } from "../valueObject/phase";
import type { Tick } from "../valueObject/tick";

const brandSymbol = Symbol("NodeInformation");

interface INodeInformation {
  id: CircuitNodeId;
  type: CircuitNodeType;
  inputs: CircuitNodeId[];
  outputs: CircuitNodeId[];
  executionOrder: ExecutionOrder;
  phase: Phase;
  tick: Tick;
  history: EvalHistory;
}

export type NodeInformation = Brand<INodeInformation, typeof brandSymbol>;

export namespace NodeInformation {
  export const from = (value: INodeInformation): NodeInformation => {
    return value as NodeInformation;
  };

  export const unBrand = (value: NodeInformation): INodeInformation => {
    return value as unknown as INodeInformation;
  };
}
