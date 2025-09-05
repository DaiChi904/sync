import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type { ICircuitEmulatorService } from "@/domain/model/service/ICircuitEmulatorService";
import { CircuitParserUsecaseError } from "@/domain/model/usecase/ICircuitParserUsecase";
import {
  GenerateCircuitEmulatorServiceClientUsecaseError,
  type IGenerateCircuitEmulatorServiceClientUsecase,
} from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
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
  ): Result<ICircuitEmulatorService, GenerateCircuitEmulatorServiceClientUsecaseError> {
    try {
      const res = this.circuitEmulatorService.from(circuitGraphData);
      if (!res.ok) {
        throw new GenerateCircuitEmulatorServiceClientUsecaseError(
          "Failed to generate circuit emulator service client.",
          {
            cause: res.error,
          },
        );
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof GenerateCircuitEmulatorServiceClientUsecaseError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitParserUsecaseError("Unknown error occurred while generating circuit data.", { cause: err }),
      };
    }
  }
}
