import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import {
  CircuitEmulatorServiceCreationError,
  type ICircuitEmulatorService,
} from "@/domain/model/service/ICircuitEmulatorService";
import { UnexpectedError } from "@/domain/model/unexpectedError";
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
    try {
      const res = this.circuitEmulatorService.from(circuitGraphData);
      if (!res.ok) {
        throw res.error;
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitEmulatorServiceCreationError: {
          const circuitEmulatorServiceCreationError = err;
          return { ok: false, error: circuitEmulatorServiceCreationError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
