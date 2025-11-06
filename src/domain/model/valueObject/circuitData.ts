import type { Brand } from "@/utils/brand";
import type { Result } from "@/utils/result";
import type { CircuitEdge } from "../entity/circuitEdge";
import type { CircuitNode } from "../entity/circuitNode";
import { ModelValidationError } from "../modelValidationError";
import { UnexpectedError } from "../unexpectedError";
import type { CircuitEdgeId } from "./circuitEdgeId";
import type { CircuitNodeId } from "./circuitNodeId";
import type { CircuitNodePinId } from "./circuitNodePinId";

const brandSymbol = Symbol("CircuitData");

interface ICircuitData {
  nodes: Array<CircuitNode>;
  edges: Array<CircuitEdge>;
}

export type CircuitData = Brand<ICircuitData, typeof brandSymbol>;

export namespace CircuitData {
  export const from = (value: ICircuitData): CircuitData => {
    return value as CircuitData;
  };

  export const unBrand = (value: CircuitData): ICircuitData => {
    return value as unknown as ICircuitData;
  };

  export const isValidData = (circuit: CircuitData): Result<void, ModelValidationError | UnexpectedError> => {
    const flags = {
      foundDuplicatedNodeId: false,
      foundDuplicatedEdgeId: false,
      foundDuplicatedNodePinId: false,
      foundDuplicatedEdge: false,
      foundSelfLoopConnection: false,
      foundDuplicatedNodePinKind: false,
    };

    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();
    const nodePinIds = new Set<string>();
    const nodePinDict = new Map<CircuitNodePinId, [CircuitNodeId, "input" | "output"]>();

    const { nodes, edges } = circuit;

    try {
      for (const node of nodes) {
        if (nodeIds.has(node.id)) {
          flags.foundDuplicatedNodeId = true;
        }
        nodeIds.add(node.id);

        for (const inputPin of node.inputs) {
          if (nodePinIds.has(inputPin)) {
            flags.foundDuplicatedNodePinId = true;
          }
          nodePinIds.add(inputPin);
          nodePinDict.set(inputPin, [node.id, "input"]);
        }

        for (const outputPin of node.outputs) {
          if (nodePinIds.has(outputPin)) {
            flags.foundDuplicatedNodePinId = true;
          }
          nodePinIds.add(outputPin);
          nodePinDict.set(outputPin, [node.id, "output"]);
        }
      }

      for (const edge of edges) {
        if (edgeIds.has(edge.id)) {
          flags.foundDuplicatedEdgeId = true;
        }
        edgeIds.add(edge.id);

        if (edge.from === edge.to) {
          flags.foundSelfLoopConnection = true;
        }

        const from = nodePinDict.get(edge.from);
        const to = nodePinDict.get(edge.to);
        if (from && to && from[0] === to[0]) {
          flags.foundSelfLoopConnection = true;
        }

        if (from && to && from[1] === to[1]) {
          flags.foundDuplicatedNodePinKind = true;
        }

        const existingEdge = edges.find((e) => e.from === edge.from && e.to === edge.to);
        if (existingEdge && existingEdge.id !== edge.id) {
          flags.foundDuplicatedEdge = true;
        }
      }

      if (Object.entries(flags).some(([_, value]) => value)) {
        throw new ModelValidationError("CircuitData", {}, "Detected invalid data.");
      }

      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const messages = Object.entries(flags)
            .filter(([_, value]) => value)
            .map(([key]) => key);

          return {
            ok: false,
            error: new ModelValidationError("CircuitData", err, `${messages.join(",\n")}.`),
          };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  };

  export const addNode = (
    circuitData: CircuitData,
    node: CircuitNode,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const updated = CircuitData.from({
      ...circuitData,
      nodes: [...circuitData.nodes, node],
    });

    const isValid = isValidData(updated);
    return isValid.ok ? { ok: true, value: updated } : { ok: false, error: isValid.error };
  };

  export const updateNode = (
    circuitData: CircuitData,
    node: CircuitNode,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const target = circuitData.nodes.find((n) => n.id === node.id);
    if (!target) {
      return { ok: false, error: new ModelValidationError("CircuitData", {}, `Node not found: ${node.id}`) };
    }

    const updatedNodes = circuitData.nodes.map((n) => (n.id === node.id ? node : n));
    return { ok: true, value: CircuitData.from({ ...circuitData, nodes: updatedNodes }) };
  };

  export const deleteNode = (
    circuitData: CircuitData,
    nodeId: CircuitNodeId,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const target = circuitData.nodes.find((node) => node.id === nodeId);
    if (!target) {
      return { ok: false, error: new ModelValidationError("CircuitData", {}, `Node not found: ${nodeId}`) };
    }

    const updated = CircuitData.from({
      nodes: circuitData.nodes.filter((node) => node.id !== nodeId),
      edges: circuitData.edges.filter(
        (edge) => ![...target.inputs].includes(edge.to) && ![...target.outputs].includes(edge.from),
      ),
    });

    const isValid = isValidData(updated);
    return isValid.ok ? { ok: true, value: updated } : { ok: false, error: isValid.error };
  };

  export const addEdge = (
    circuitData: CircuitData,
    edge: CircuitEdge,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const updated = CircuitData.from({
      nodes: circuitData.nodes,
      edges: [...circuitData.edges, edge],
    });

    const isValid = isValidData(updated);
    return isValid.ok ? { ok: true, value: updated } : { ok: false, error: isValid.error };
  };

  export const updateEdge = (
    circuitData: CircuitData,
    edge: CircuitEdge,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const target = circuitData.edges.find((e) => e.id === edge.id);
    if (!target) {
      return { ok: false, error: new ModelValidationError("CircuitData", {}, `Edge not found: ${edge.id}`) };
    }

    const updatedEdges = circuitData.edges.map((e) => (e.id === edge.id ? edge : e));
    const updated = CircuitData.from({ ...circuitData, edges: updatedEdges });

    const isValid = isValidData(updated);
    return isValid.ok ? { ok: true, value: updated } : { ok: false, error: isValid.error };
  };

  export const deleteEdge = (
    circuitData: CircuitData,
    edgeId: CircuitEdgeId,
  ): Result<CircuitData, ModelValidationError | UnexpectedError> => {
    const target = circuitData.edges.find((edge) => edge.id === edgeId);
    if (!target) {
      return { ok: false, error: new ModelValidationError("CircuitData", {}, `Edge not found: ${edgeId}`) };
    }

    const updated = CircuitData.from({
      nodes: circuitData.nodes,
      edges: circuitData.edges.filter((edge) => edge.id !== edgeId),
    });

    const isValid = isValidData(updated);
    return isValid.ok ? { ok: true, value: updated } : { ok: false, error: isValid.error };
  };
}
