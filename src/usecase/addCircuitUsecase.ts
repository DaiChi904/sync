import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  ICircuitRepository,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IAddCircuitUsecase } from "@/domain/model/usecase/IAddCircuitUsecase";
import type { Result } from "@/utils/result";

interface AddCircuitUsecaseDependencies {
  circuitRepository: ICircuitRepository;
}

export class AddCircuitUsecase implements IAddCircuitUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: AddCircuitUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async execute(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("ADD", newCircuit);
  }
}
