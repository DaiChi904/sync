import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitEmulatorServiceCreationError, ICircuitEmulatorService } from "../service/ICircuitEmulatorService";
import type { UnexpectedError } from "../unexpectedError";

export interface IGenerateCircuitEmulatorServiceClientUsecase {
  generate(
    circuitGraphData: CircuitGraphData,
  ): Result<ICircuitEmulatorService, CircuitEmulatorServiceCreationError | UnexpectedError>;
}
