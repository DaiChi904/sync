import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { ICircuitEmulatorService } from "../service/ICircuitEmulatorService";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { Coordinate } from "../valueObject/coordinate";

export type IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput = Readonly<Result<ICircuitEmulatorService>>;

type GenerateNewCircuitDataAddPayload =
  | {
      type: "Node";
      nodeId: CircuitNodeId;
      nodeType: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }
  | {
      type: "Edge";
      edgeId: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Coordinate[];
    };

type GenerateNewCircuitDataUpdatePayload =
  | {
      type: "Node";
      nodeId: CircuitNodeId;
      nodeType: CircuitNodeType;
      inputs: CircuitNodePinId[];
      outputs: CircuitNodePinId[];
      coordinate: Coordinate;
      size: CircuitNodeSize;
    }
  | {
      type: "Edge";
      edgeId: CircuitEdgeId;
      from: CircuitNodePinId;
      to: CircuitNodePinId;
      waypoints: Coordinate[];
    };

type GenerateNewCircuitDataDeletePayload = { type: "Node"; id: CircuitNodeId } | { type: "Edge"; id: CircuitEdgeId };

export type GenerateNewCircuitDataRequest =
  | { method: "ADD"; payload: GenerateNewCircuitDataAddPayload }
  | { method: "UPDATE"; payload: GenerateNewCircuitDataUpdatePayload }
  | { method: "DELETE"; payload: GenerateNewCircuitDataDeletePayload };

export interface ICircuitEditorUsecase {
  generateNewCircuitData(circuitData: CircuitData, request: GenerateNewCircuitDataRequest): Result<CircuitData>;
  generateNewGuiData(circuitData: CircuitData): Result<CircuitGuiData>;
  saveCircuit(newCircuit: Circuit): Promise<Result<void>>;
}
