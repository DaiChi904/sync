import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitData } from "../valueObject/circuitData";

export class CircuitParserServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitParserServiceError";
    this.cause = options?.cause;
  }
}

export interface ICircuitParserService {
  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData, CircuitParserServiceError>;
  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData, CircuitParserServiceError>;
}
