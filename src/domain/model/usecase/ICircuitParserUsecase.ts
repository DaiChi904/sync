import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitData } from "../valueObject/circuitData";

export class CircuitParserUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitParserUsecaseError";
    this.cause = options?.cause;
  }
}

export interface ICircuitParserUsecase {
  parseToGuiData(textData: CircuitData): Result<CircuitGuiData, CircuitParserUsecaseError>;
  parseToGraphData(textData: CircuitData): Result<CircuitGraphData, CircuitParserUsecaseError>;
}
