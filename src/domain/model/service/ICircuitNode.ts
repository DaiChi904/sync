import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { ExecutionOrder } from "../valueObject/executionOrder";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";
import type { Tick } from "../valueObject/tick";

export class CircuitNodeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitNodeError";
    this.cause = options?.cause;
  }
}

export interface ICircuitNode {
  setup(order: ExecutionOrder): Result<void, undefined>;
  init(): Result<void, CircuitNodeError>;
  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<boolean, CircuitNodeError>;
  getInformation(): NodeInformation;
}
