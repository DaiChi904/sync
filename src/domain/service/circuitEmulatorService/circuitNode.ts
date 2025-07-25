import { NodeInformation } from "@/domain/model/entity/nodeInfomation.type";
import type { ICircuitNode } from "@/domain/model/service/ICircuitNode";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { EvalHistory } from "@/domain/model/valueObject/evalHistory";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { ExecutionOrder } from "@/domain/model/valueObject/executionOrder";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { Phase } from "@/domain/model/valueObject/phase";
import { Tick } from "@/domain/model/valueObject/tick";
import type { Result } from "@/utils/result";

export class CircuitNodeFromError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitNodeFromError";
  }
}

export class CircuitNodeInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitNodeInitError";
  }
}

export class CircuitNodeEvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitNodeEvalError";
  }
}

export abstract class CircuitNode implements ICircuitNode {
  protected readonly id: CircuitNodeId;
  protected readonly type: CircuitNodeType;
  protected readonly inputs: Array<CircuitNodeId>;
  protected readonly outputs: Array<CircuitNodeId>;
  protected executionOrder: ExecutionOrder;
  protected phase: Phase;
  protected tick: Tick;
  protected history: EvalHistory;

  constructor(id: CircuitNodeId, type: CircuitNodeType, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    this.id = CircuitNodeId.from(id);
    this.type = CircuitNodeType.from(type);
    this.inputs = inputs.map(CircuitNodeId.from);
    this.outputs = outputs.map(CircuitNodeId.from);
    this.executionOrder = ExecutionOrder.from(NaN);
    this.phase = Phase.from(NaN);
    this.tick = Tick.from(NaN);
    this.history = EvalHistory.from(new Map());
  }

  static from(
    id: CircuitNodeId,
    type: CircuitNodeType,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
  ): Result<EntryNode | ExitNode | AndNode | OrNode | NotNode | JunctionNode> {
    switch (type) {
      case "ENTRY":
        return { ok: true, value: new EntryNode(id, inputs, outputs) };
      case "EXIT":
        return { ok: true, value: new ExitNode(id, inputs, outputs) };
      case "AND":
        return { ok: true, value: new AndNode(id, inputs, outputs) };
      case "OR":
        return { ok: true, value: new OrNode(id, inputs, outputs) };
      case "NOT":
        return { ok: true, value: new NotNode(id, inputs, outputs) };
      case "JUNCTION":
        return { ok: true, value: new JunctionNode(id, inputs, outputs) };
      default:
        return { ok: false, error: new CircuitNodeFromError(`Invalid node type: ${type}`) };
    }
  }

  setup(order: ExecutionOrder): Result<void> {
    this.executionOrder = order;
    this.phase = Phase.from(0);
    this.tick = Tick.from(0);
    this.history = EvalHistory.from(new Map([[this.phase, new Map()]]));
    return { ok: true, value: undefined };
  }

  init(): Result<void> {
    this.phase = Phase.from(1);
    this.tick = Tick.from(0);
    // biome-ignore lint/style/noNonNullAssertion: This is cared by the next if statement.
    const initialHistory = this.history!.get(Phase.from(0));
    if (!initialHistory)
      return {
        ok: false,
        error: new CircuitNodeInitError("Failed to initialize node. This node might not be setup yet."),
      };

    this.history = EvalHistory.from(new Map([[Phase.from(0), initialHistory]]));
    return { ok: true, value: undefined };
  }

  abstract eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult>;
  abstract getInformation(): NodeInformation;

  protected saveOutput(phase: Phase, tick: Tick, output: EvalResult): Result<void> {
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    // biome-ignore lint/style/noNonNullAssertion: This is cared by the previous if statement.
    this.history.get(phase)!.set(tick, output);
    return { ok: true, value: undefined };
  }
}

// --- EntryNode ---
class EntryNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("ENTRY"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.outputs.length !== 1) {
      return { ok: false, error: new CircuitNodeEvalError(`ENTRY node "${this.id}" must have exactly one output`) };
    }
    this.phase = phase;
    this.tick = tick;
    const result = { CircuitNodeOutputId: this.outputs[0], output: inputs[CircuitNodeInputId.from(this.id)] ?? false };
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    this.saveOutput(phase, tick, result.output);
    return { ok: true, value: result.output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}

// --- ExitNode ---
class ExitNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("EXIT"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.inputs.length !== 1 || this.outputs.length !== 0) {
      return { ok: false, error: new CircuitNodeEvalError(`EXIT node "${this.id}" must have exactly one input`) };
    }

    this.phase = phase;
    this.tick = tick;
    const result = { CircuitNodeOutputId: this.id, output: inputs[CircuitNodeInputId.from(this.inputs[0])] ?? false };
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    this.saveOutput(phase, tick, result.output);
    return { ok: true, value: result.output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}

// --- AndNode ---
class AndNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("AND"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.inputs.length !== 2 || this.outputs.length !== 1) {
      return {
        ok: false,
        error: new CircuitNodeEvalError(`AND node "${this.id}" must have exactly two inputs and one output`),
      };
    }
    this.phase = phase;
    this.tick = tick;
    const a = inputs[CircuitNodeInputId.from(this.inputs[0])] ?? false;
    const b = inputs[CircuitNodeInputId.from(this.inputs[1])] ?? false;
    const result = { CircuitNodeOutputId: this.outputs[0], output: a && b };
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    this.saveOutput(phase, tick, result.output);
    return { ok: true, value: result.output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}

// --- OrNode ---
class OrNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("OR"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.inputs.length !== 2 || this.outputs.length !== 1) {
      return {
        ok: false,
        error: new CircuitNodeEvalError(`OR node "${this.id}" must have exactly two inputs and one output`),
      };
    }
    this.phase = phase;
    this.tick = tick;
    const a = inputs[CircuitNodeInputId.from(this.inputs[0])] ?? false;
    const b = inputs[CircuitNodeInputId.from(this.inputs[1])] ?? false;
    const result = { CircuitNodeOutputId: this.outputs[0], output: a || b };
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    this.saveOutput(phase, tick, result.output);
    return { ok: true, value: result.output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}

// --- NotNode ---
class NotNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("NOT"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.inputs.length !== 1 || this.outputs.length !== 1) {
      return {
        ok: false,
        error: new CircuitNodeEvalError(`NOT node "${this.id}" must have exactly one input and one output`),
      };
    }
    this.phase = phase;
    this.tick = tick;
    const input = inputs[CircuitNodeInputId.from(this.inputs[0])] ?? false;
    const result = { CircuitNodeOutputId: this.outputs[0], output: EvalResult.from(!input) };
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    this.saveOutput(phase, tick, result.output);
    return { ok: true, value: result.output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}

// --- JunctionNode ---
class JunctionNode extends CircuitNode {
  constructor(id: CircuitNodeId, inputs: Array<CircuitNodeId>, outputs: Array<CircuitNodeId>) {
    super(id, CircuitNodeType.from("JUNCTION"), inputs, outputs);
  }

  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<EvalResult> {
    if (this.inputs.length !== 1 || this.outputs.length < 1) {
      return {
        ok: false,
        error: new CircuitNodeEvalError(`JUNCTION node "${this.id}" must have one input and at least one output`),
      };
    }
    this.phase = phase;
    this.tick = tick;
    const output = inputs[CircuitNodeInputId.from(this.inputs[0])] ?? false;
    const result = this.outputs.map((CircuitNodeOutputId) => ({
      CircuitNodeOutputId: CircuitNodeOutputId,
      output: output,
    }));
    if (!this.history.has(phase)) {
      this.history.set(phase, new Map());
    }
    result.forEach((result) => {
      this.saveOutput(phase, tick, result.output);
    });
    // As all JUNCTION outputs are identical, it is allowed to return one of the multiple outputs.
    return { ok: true, value: result[0].output };
  }

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      phase: this.phase,
      tick: this.tick,
      history: this.history,
    });
  }
}
