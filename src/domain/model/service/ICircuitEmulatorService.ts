import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export class CircuitEmulatorServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulatorService {
  setup(): Result<void, CircuitEmulatorServiceError>;
  eval(entryInputs: InputRecord, phase: Phase): Result<void, CircuitEmulatorServiceError>;
  getInfomationById(id: CircuitNodeId): Result<NodeInformation, CircuitEmulatorServiceError>;
}
