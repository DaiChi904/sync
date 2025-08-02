import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type {
  IGenerateCircuitEmulatorServiceClientUsecase,
  IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput,
} from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
import type { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";

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
      return { ok: false, error: res.error };
    }

    return { ok: true, value: res.value };
  }
}
