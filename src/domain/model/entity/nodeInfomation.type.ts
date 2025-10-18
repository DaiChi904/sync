import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { EvalDelay } from "../valueObject/evalDelay";
import type { EvalResult } from "../valueObject/evalResult";
import type { ExecutionOrder } from "../valueObject/executionOrder";

const brandSymbol = Symbol("NodeInformation");

interface INodeInformation {
  id: CircuitNodeId;
  type: CircuitNodeType;
  inputs: CircuitNodeId[];
  outputs: CircuitNodeId[];
  executionOrder: ExecutionOrder;
  delay: EvalDelay;
  lastOutput: EvalResult;
  outputQueue: Array<EvalResult>;
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
