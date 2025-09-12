import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";

export class CircuitEmulatorServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulatorService {
  reset(): void;
  eval(entryInputs: InputRecord): Result<Map<CircuitNodeId, EvalResult>, CircuitEmulatorServiceError>;
  getInfomationById(id: CircuitNodeId): Result<NodeInformation, CircuitEmulatorServiceError>;
}
