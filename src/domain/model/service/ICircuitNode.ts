import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";

export class CircuitNodeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitNodeError";
    this.cause = options?.cause;
  }
}

export interface ICircuitNode {
  init(): void;
  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError>;
  getInformation(): NodeInformation;
}
