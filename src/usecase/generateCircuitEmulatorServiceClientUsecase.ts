import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type {
  CircuitEmulatorServiceCreationError,
  ICircuitEmulatorService,
} from "@/domain/model/service/ICircuitEmulatorService";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IGenerateCircuitEmulatorServiceClientUsecase } from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
import type { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";
import type { Result } from "@/utils/result";

interface GenerateCircuitEmulatorServiceClientUsecaseDependencies {
  circuitEmulatorService: typeof CircuitEmulatorService;
}

export class GenerateCircuitEmulatorServiceClientUsecase implements IGenerateCircuitEmulatorServiceClientUsecase {
  private readonly circuitEmulatorService: typeof CircuitEmulatorService;

  constructor({ circuitEmulatorService }: GenerateCircuitEmulatorServiceClientUsecaseDependencies) {
    this.circuitEmulatorService = circuitEmulatorService;
  }

  generate(
    circuitGraphData: CircuitGraphData,
  ): Result<ICircuitEmulatorService, CircuitEmulatorServiceCreationError | UnexpectedError> {
    return this.circuitEmulatorService.from(circuitGraphData);
  }
}
