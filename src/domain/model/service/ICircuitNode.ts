import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { ExecutionOrder } from "../valueObject/executionOrder";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";
import type { Tick } from "../valueObject/tick";

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

export class CircuitNodeInitializeError extends Error {
  constructor(
    readonly id: CircuitNodeId,
    readonly type: CircuitNodeType,
    options?: { cause?: unknown },
  ) {
    super(
      `Initialize failed because of missing initial history in phase 0. This node might not be setup yet. id: ${id}, type: ${type}`,
    );
    this.name = "CircuitNodeInitializeError";
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
  setup(order: ExecutionOrder): Result<void, undefined>;
  init(): Result<void, CircuitNodeInitializeError | UnexpectedError>;
  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<boolean, CircuitNodeEvalError | UnexpectedError>;
  getInformation(): NodeInformation;
}
