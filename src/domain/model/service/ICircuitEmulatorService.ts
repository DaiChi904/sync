import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { InputRecord } from "../valueObject/inputRecord";
import type { OutputRecord } from "../valueObject/outputRecord";

export class CircuitEmulatorServiceCreationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulatorServiceCreationError";
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

export class NodeNotFoundError extends Error {
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
  reset(): void;
  eval(entryInputs: InputRecord): Result<OutputRecord, CircuitEmulatorServiceEvalError | UnexpectedError>;
  getAllNodesInfo(): Array<NodeInformation>;
  getInfomationById(id: CircuitNodeId): Result<NodeInformation, NodeNotFoundError>;
}
