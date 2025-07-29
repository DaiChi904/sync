import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type {
  IGenerateCircuitEmulatorServiceClientUsecase,
  IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput,
} from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
import type { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";

export class GenerateCircuitEmulatorServiceClientUsecaseError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "GenerateCircuitEmulatorServiceClientUsecaseError";
    this.cause = options.cause;
  }
}

interface GenerateCircuitEmulatorServiceClientUsecaseDependencies {
  circuitEmulatorService: typeof CircuitEmulatorService;
}

export class GenerateCircuitEmulatorServiceClientUsecase implements IGenerateCircuitEmulatorServiceClientUsecase {
  private readonly circuitEmulatorService: typeof CircuitEmulatorService;

  constructor({ circuitEmulatorService }: GenerateCircuitEmulatorServiceClientUsecaseDependencies) {
    this.circuitEmulatorService = circuitEmulatorService;
  }

  generate(circuitGraphData: CircuitGraphData): IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput {
    const res = this.circuitEmulatorService.from(circuitGraphData);
    if (!res.ok) {
      return {
        ok: false,
        error: new GenerateCircuitEmulatorServiceClientUsecaseError("Failed to generate circuit emulator service.", {
          cause: res.error,
        }),
      };
    }

    return { ok: true, value: res.value };
  }
}
