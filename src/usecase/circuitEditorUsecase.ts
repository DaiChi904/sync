import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  ICircuitRepository,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async add(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("ADD", newCircuit);
  }

  async save(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("UPDATE", newCircuit);
  }

  async delete(
    id: CircuitId,
  ): Promise<Result<void, DataIntegrityError | InfraError | CircuitNotFoundError | UnexpectedError>> {
    return await this.circuitRepository.delete(id);
  }
}
