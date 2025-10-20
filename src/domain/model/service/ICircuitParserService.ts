import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitData } from "../valueObject/circuitData";

export class CircuitDataParseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitDataParseError";
    this.cause = options?.cause;
  }
}

export interface ICircuitParserService {
  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData, CircuitDataParseError | UnexpectedError>;
  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData, CircuitDataParseError | UnexpectedError>;
}
