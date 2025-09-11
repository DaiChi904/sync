import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { ICircuitEmulatorService } from "../service/ICircuitEmulatorService";

export class GenerateCircuitEmulatorServiceClientUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "GenerateCircuitEmulatorServiceClientUsecaseError";
    this.cause = options?.cause;
  }
}

export interface IGenerateCircuitEmulatorServiceClientUsecase {
  generate(
    circuitGraphData: CircuitGraphData,
  ): Result<ICircuitEmulatorService, GenerateCircuitEmulatorServiceClientUsecaseError>;
}
