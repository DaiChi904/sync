import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export class CircuitEmulatorServiceCreationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceCreationError";
    this.cause = options?.cause;
  }
}

export class CircuitEmulatorServiceSetupError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceSetupError";
    this.cause = options?.cause;
  }
}

export class CircuitEmulatorServiceEvalError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceEvalError";
    this.cause = options?.cause;
  }
}

export class NodeInfomationNotFoundError extends Error {
  constructor(id: CircuitNodeId, options?: { cause?: unknown }) {
    super(`Node not found: ${id}`);
    this.name = "NodeInfomationNotFoundError";
    this.cause = options?.cause;
  }
}

export class CircuitEmulatorServiceInternalError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceInternalError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulatorService {
  setup(): Result<void, CircuitEmulatorServiceSetupError | UnexpectedError>;
  eval(entryInputs: InputRecord, phase: Phase): Result<void, CircuitEmulatorServiceEvalError | UnexpectedError>;
  getInfomationById(id: CircuitNodeId): Result<NodeInformation, NodeInfomationNotFoundError>;
}
