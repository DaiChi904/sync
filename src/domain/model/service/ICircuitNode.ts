import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";

export class CircuitNodeCreationError extends Error {
  constructor(
    readonly id: CircuitNodeId,
    readonly type: CircuitNodeType,
    options?: { cause?: unknown },
  ) {
    super(`Received invalid node type. Id: ${id}, Type:${type}`);
    this.name = "CircuitNodeCreationError";
    this.cause = options?.cause;
  }
}

export class CircuitNodeEvalError extends Error {
  constructor(
    message: string,
    readonly info: NodeInformation,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = "CircuitNodeEvalError";
    this.cause = options?.cause;
  }
}

export interface ICircuitNode {
  init(): void;
  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError>;
  getInformation(): NodeInformation;
}
