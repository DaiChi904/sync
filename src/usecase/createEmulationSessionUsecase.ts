import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type { IEmulationOrganizer } from "@/domain/model/service/IEmulationOrganizer";
import {
  EmulationSessionCreationError,
  type ICreateEmulationSessionUsecase,
} from "@/domain/model/usecase/ICreateEmulationSessionUsecase";
import type { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import type { CircuitEmulatorService } from "@/domain/service/circuitEmulatorService";
import type { EmulationOrganizer } from "@/domain/service/emulationOrganizer";
import type { Result } from "@/utils/result";

interface GenerateCircuitEmulatorServiceClientUsecaseDependencies {
  circuitEmulatorService: typeof CircuitEmulatorService;
  emulationOrganizer: typeof EmulationOrganizer;
}

export class CreateEmulationSessionUsecase implements ICreateEmulationSessionUsecase {
  private readonly circuitEmulatorService: typeof CircuitEmulatorService;
  private readonly emulationOrganizer: typeof EmulationOrganizer;

  constructor({ circuitEmulatorService, emulationOrganizer }: GenerateCircuitEmulatorServiceClientUsecaseDependencies) {
    this.circuitEmulatorService = circuitEmulatorService;
    this.emulationOrganizer = emulationOrganizer;
  }

  createSession(
    circuitGraphData: CircuitGraphData,
    config: { evalDelay: EvalDelay },
  ): Result<IEmulationOrganizer, EmulationSessionCreationError> {
    const client = this.circuitEmulatorService.from(circuitGraphData, config.evalDelay);
    if (!client.ok) {
      const err = new EmulationSessionCreationError("Creating emulation session failed.", {
        cause: client.error,
      });
      console.error(err);
      return { ok: false, error: err };
    }

    const organizer = this.emulationOrganizer.from(client.value);

    return { ok: true, value: organizer };
  }
}
