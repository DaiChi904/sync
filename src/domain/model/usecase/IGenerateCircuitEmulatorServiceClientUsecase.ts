import type { Result } from "@/utils/result";
import type { CircuitEmulatorServiceCreationError, ICircuitEmulatorService } from "../service/ICircuitEmulatorService";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitGraphData } from "../valueObject/circuitGraphData";

export interface IGenerateCircuitEmulatorServiceClientUsecase {
  generate(
    circuitGraphData: CircuitGraphData,
  ): Result<ICircuitEmulatorService, CircuitEmulatorServiceCreationError | UnexpectedError>;
}
