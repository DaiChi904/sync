import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type {
  GenerateNewCircuitDataRequest,
  ICircuitEditorUsecase,
} from "@/domain/model/usecase/ICircuitEditorUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { Result } from "@/utils/result";

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecaseGenerateNewCircuitDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEditorUsecaseGenerateNewCircuitDataError";
  }
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitRepository, circuitParserService }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
    this.circuitParserService = circuitParserService;
  }

  generateNewCircuitData(textData: CircuitData, request: GenerateNewCircuitDataRequest): Result<CircuitData> {
    const splited = CircuitData.unBrand(textData)
      .split(";")
      .map((line) => line.trim())
      .map((line) => line.split(","))
      .map((line) => line.map((item) => item.trim()));

    const nodeLastIdx = splited.map((line) => line[0]).lastIndexOf("Node");
    const edgeLastIdx = splited.map((line) => line[0]).lastIndexOf("Edge");

    switch (request.method) {
      case "ADD": {
        switch (request.payload.type) {
          case "Node": {
            const payload = request.payload;
            const foward = [...splited.slice(0, nodeLastIdx + 1)];
            const backward = [...splited.slice(nodeLastIdx + 1)];
            const newData =
              foward.map((line) => line.join(", ")).join(";\n") +
              `Node, ${payload.nodeId}, ${payload.type}, [${payload.inputs.join(" | ")}], [${payload.outputs.join(" | ")}], [${payload.coordinate.x}:${payload.coordinate.y}], [${payload.size.x}:${payload.size.y}];\n` +
              backward.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          case "Edge": {
            const payload = request.payload;
            const foward = [...splited.slice(0, edgeLastIdx + 1)];
            const backward = [...splited.slice(edgeLastIdx + 1)];
            const newData =
              foward.map((line) => line.join(", ")).join(";\n") +
              `Edge, ${payload.edgeId}, ${payload.type}, [${payload.from} -> ${payload.to}], [${payload.waypoints.length > 0 ? payload.waypoints.map((waypoint) => `[${waypoint.x}:${waypoint.y}]`).join(" -> ") : "NONE"}];\n` +
              backward.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          default: {
            return {
              ok: false,
              error: new CircuitEditorUsecaseGenerateNewCircuitDataError("Invalid payload type for DELETE method"),
            };
          }
        }
      }
      case "UPDATE": {
        switch (request.payload.type) {
          case "Node": {
            const payload = request.payload;
            const filtered = splited.filter((line) => payload.nodeId !== line[1]);
            const foward = [...filtered.slice(0, nodeLastIdx + 1)];
            const backward = [...filtered.slice(nodeLastIdx + 1)];
            const newData =
              foward.map((line) => line.join(", ")).join(";\n") +
              `Node, ${payload.nodeId}, ${payload.type}, [${payload.inputs.join(" | ")}], [${payload.outputs.join(" | ")}], [${payload.coordinate.x}:${payload.coordinate.y}], [${payload.size.x}:${payload.size.y}];\n` +
              backward.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          case "Edge": {
            const payload = request.payload;
            const filtered = splited.filter((line) => payload.edgeId !== line[1]);
            const foward = [...filtered.slice(0, nodeLastIdx + 1)];
            const backward = [...filtered.slice(nodeLastIdx + 1)];
            const newData =
              foward.map((line) => line.join(", ")).join(";\n") +
              `Edge, ${payload.edgeId}, ${payload.type}, [${payload.from} -> ${payload.to}], [${payload.waypoints.length > 0 ? payload.waypoints.map((waypoint) => `[${waypoint.x}:${waypoint.y}]`).join(" -> ") : "NONE"}];\n` +
              backward.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          default: {
            return {
              ok: false,
              error: new CircuitEditorUsecaseGenerateNewCircuitDataError("Invalid payload type for UPDATE method"),
            };
          }
        }
      }

      case "DELETE": {
        switch (request.payload.type) {
          case "Node": {
            const payload = request.payload;
            const filtered = splited.filter((line) => payload.id !== line[1]);
            const newData = filtered.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          case "Edge": {
            const payload = request.payload;
            const filtered = splited.filter((line) => payload.id !== line[1]);
            const newData = filtered.map((line) => line.join(", ")).join(";\n");
            return { ok: true, value: CircuitData.from(newData) };
          }
          default: {
            return {
              ok: false,
              error: new CircuitEditorUsecaseGenerateNewCircuitDataError("Invalid payload type for DELETE method"),
            };
          }
        }
      }

      default: {
        return { ok: false, error: new CircuitEditorUsecaseGenerateNewCircuitDataError("Invalid method") };
      }
    }
  }

  generateNewGuiData(textData: CircuitData): Result<CircuitGuiData> {
    const res = this.circuitParserService.parseToGuiData(textData);

    switch (res.ok) {
      case true: {
        return { ok: true, value: res.value };
      }
      case false: {
        console.error(res.error);
        return { ok: false, error: res.error };
      }
    }
  }

  async saveCircuit(newCircuit: Circuit): Promise<Result<void>> {
    const res = await this.circuitRepository.save("UPDATE", newCircuit);

    switch (res.ok) {
      case true: {
        return { ok: true, value: undefined };
      }
      case false: {
        console.error(res.error);
        return { ok: false, error: res.error };
      }
    }
  }
}
