import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type {
  IGenerateCircuitEmulatorServiceClientUsecase,
  IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput,
} from "@/domain/model/usecase/IGenerateCircuitEmulatorServiceClientUsecase";
import type { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";
import { Attempt } from "@/utils/attempt";

interface GenerateCircuitEmulatorServiceClientUsecaseDependencies {
  circuitEmulatorService: typeof CircuitEmulatorService;
}

export class GenerateCircuitEmulatorServiceClientUsecase implements IGenerateCircuitEmulatorServiceClientUsecase {
  private readonly circuitEmulatorService: typeof CircuitEmulatorService;

  constructor({ circuitEmulatorService }: GenerateCircuitEmulatorServiceClientUsecaseDependencies) {
    this.circuitEmulatorService = circuitEmulatorService;
  }

  generate(circuitGraphData: CircuitGraphData): IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput {
    return Attempt.proceed(
      () => {
        const res = this.circuitEmulatorService.from(circuitGraphData);
        if (!res.ok) {
          throw new Attempt.Abort(
            "GenerateCircuitEmulatorServiceClientUsecase.generate",
            "Failed to generate circuit emulator service client.",
            {
              cause: res.error,
            },
          );
        }

        return { ok: true, value: res.value } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }
}
