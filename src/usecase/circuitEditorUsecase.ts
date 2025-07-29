import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { Result } from "@/utils/result";

export class CircuitEditorUsecaseError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "CircuitEditorUsecaseError";
    this.cause = options.cause;
  }
}

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async save(newCircuit: Circuit): Promise<Result<void>> {
    const res = await this.circuitRepository.save("UPDATE", newCircuit);
    if (!res.ok) {
      return { ok: false, error: new CircuitEditorUsecaseError("Failed to save circuit.", { cause: res.error }) };
    }

    return res;
  }
}
