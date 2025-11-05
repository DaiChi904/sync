# Description Emulation Logic And Implementation

If you did not read `data-parsing.md` yet, it is recommended to read that first.

This document describes how the `CircuitGraphData` (parsed from `CircuitData`) is used to emulate the behavior of the circuit.

# Basics

The emulation logic is consists with three elements of `EmulationOrganizer`, `CircuitEmulatorService`, collection of `CircuitNode`.

`EmulationOrganizer` takes role of orchestrating the emulation process.
It manages the overall emulation flow, handling between handler and service.

`CircuitEmulatorService` is responsible for the actual emulation logic.
This service execute circuit emulation by one tick.
This is implemented by evaluationg all `CircuitNode`s by the execution order.

The collection of `CircuitNode` refers to the individual logic gates (e.g., AND, OR, NOT).
Each `CircuitNode` has a defined behavior which determines its output based on its inputs.

# Semi-Topological Sort

## About Semi-Topological Sort

Before getting to details of logic, describe about semi-topological sort.
Semi-topological sort is the algorithm which extend topological sort.
This is algorithm which determine the execution order of nodes.
This algorithm does not exist in the real world, but for convenience I shall refer to it as such here.

Considering emulation of logic circuit on program, the biggest factor to think is each logic nodes have to be processed sequentially one by one.
That's mean it is important to determin order to evaluate each nodes.

As mentioned in `data-parsing.md`, circuit is understaned as a directed graph for emulation in this app.
First of all, a logic circuit consists of two elements: logic gates and the wires connecting them.
The fundamental principle of a logic circuit's operation is to receive input from the preceding stage and propagate it to the next logic element. That is, it is self-evident that all outputs depend on the outputs preceding them.
When interpreted as a directed graph, the dependencies can be resoloved by a topological sort.

The circuit which has no loop structure such as half/full adder, it is possible to apply topogical sort directly.
However, the circuit which has loop such as Flip Flop, it is not possible to apply topological sort directly.
Therefore, a pure topological sort cannot be applied for determing execution order of nodes.
Instead, a "semi-topological sort" approach is used.

## Breef description

1. Perform topological sort on the directed graph until it becomes unsortable
2. Find the endpoint of the last edge removed
3. Cut all edges directed towards that endpoint
4. Repeat steps 1 to 3 until sorting is complete

## Predude

```predude
PROCESS SemiTopologicalSort
    INPUT graph
    SET graphInProcess = graph
    SET nodeAmount = getAmountOfNodes(graph)
    SET edgeLastRemoved = null
    SET queue = []

    WHILE queue.length !== nodeAmount
        SET noDepsNode = popNoDepsNode(graphInProcess)

        IF noDepsNode === null
            SET node = findTerminalNode(edgeLastRemoved)
            cutAllDepEdges(graphInProcess, node)
        ELSE
            SET edgeLastRemoved = cutEdge(graphInProcess)
            queue.push(noDepsNode)
END
```

**Note**

SemiTopologicalSort requires a directed graph containing at least one node with no dependencies. 

# Emulation Process

## Basic Concept

Emulation is performed with one tick as the execution unit.
For each tick, each node is evaluated once in turn according to the execution order.

`CircuitNode` is object which is manipulated by `CircuitEmlatorService`.
This object has two status of `lastOutput` and `outputQueue`, but `lastOutput` does not have to be considered here because this state is used for only a part of `NodeInformation` defined as entity.

In each evaluation, `CircuitNode` is given `inputRecord` and execute evaluation.
Then, its output is pushed into internal queue and return head result in the queue.
And the length of queue is related to the value of `EvalDelay` which is natural number greater than or equal to 1.
Thus, the result of each tick is returend after $n$ EvalDelay.
However, this delay mechanism is experimental; while the implementation as a queue will be maintained, delays of two or more may be discontinued in future.

## Initialization

The main instantiation processes of the `CircuitEmulatorService` is as follows:

1. Determine Execution Order:\
   It extracts node and edge information from `CircuitGraphData` and performs a semi-topological sort to determine the evaluation order of all nodes, even in circuits with loop structures.
2. Instantiate `CircuitNode`:\
   According to the determined execution order, it generates an instance of `CircuitNode` corresponding to each node.
3.  Initialize `CircuitNode`:\
   It calls the `init()` method for each generated `CircuitNode` instance. This initializes the internal state of the node (`lastOutput` and `outputQueue`). The `outputQueue` is an array with a length based on `evalDelay`, filled with `false`. This forms the basis for emulating signal propagation delay.
4. `EmulationOrganizer` Will Initialize Circuit:\
   `EmulationOrganizer` will execute evaluation with all entry input as false until following conditions are satisfied.
   1. All outputs of each nodes are identical duaring certain ticks (called `stability threshold`)
   2. Reach to the maximum iteration limit (called `iteration limit`)

   In case of 1, the circuit is considered stable and the emulation can begin.
   In case of 2, the circuit is considered unstable or oscillating, then the emulation will proceed with the last state when reached to the iteration limit.

   `iteration limit` and `stability threshold` are calculated by following formula.

   ```math
    iterationLimit = (\text{amount of node}) * 2 + (\text{amount of node}) * maxDelay + (\text{EXTRA ITERATION LIMIT})
   ```

   ```math
    stabilityThreshold = (\text{maximum evalDelay in all nodes}) + 1
   ```

### Why initial `circuitNode` has state of `outputQueue` filled with `false`?

This is because the initial state of all nodes in a digital circuit is typically considered to be "off" or "low" (represented by `false`). In addition, without that state, it is impossible to execute initial evaluation because the dependencies of output from behind nodes are not determined in the circuit with loop structures.

## Emulation

`EmulationOrganizer` controls emulation, but it is `CircuitEmulatorService` that execute actual emulation tick by tick.
In the emulation logic, `EmulationOrganizer` is stateless and `CircuitEmulatorService` is statefull.
