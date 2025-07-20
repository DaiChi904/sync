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

  async generate(
    circuitGraphData: CircuitGraphData,
  ): Promise<IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput> {
    const res = this.circuitEmulatorService.from(circuitGraphData);

    switch (res.ok) {
      case true: {
        return { ok: true, value: res.value };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
