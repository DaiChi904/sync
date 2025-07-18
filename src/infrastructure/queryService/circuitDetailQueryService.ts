import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type {
  CircuitDetailQueryServiceGetByIdOutput,
  ICircuitDetailQueryService,
} from "@/domain/model/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitDetailQueryServiceGetByIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitDetailQueryServiceGetByIdError";
  }
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitRepository, circuitParserService }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
    this.circuitParserService = circuitParserService;
  }

  async getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput> {
    const res = await this.circuitRepository.getById(id);

    switch (res.ok) {
      case true: {
        const circuit = res.value;

        const parseRes = this.circuitParserService.parseToGuiData(circuit.circuitData);
        if (!parseRes.ok) {
          return { ok: false, error: parseRes.error };
        }

        const overview = CircuitOverview.from({
          id: circuit.id,
          title: circuit.title,
          description: circuit.description,
          createdAt: circuit.createdAt,
          updatedAt: circuit.updatedAt,
        });

        return { ok: true, value: { circuitOverview: overview, guiData: parseRes.value } };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
