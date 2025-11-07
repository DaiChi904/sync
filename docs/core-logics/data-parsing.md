# Description of Data Parsing

The following is the data for a circuit.
This data is basement for GUI and emulation.

```ts
interface CircuitData {
    nodes: Array<{
        id: CircuitNodeId;
        type: CircuitNodeType;
        inputs: Array<CircuitNodePinId>;
        outputs: Array<CircuitNodePinId>;
        coordinate: Coordinate;
        size: CircuitNodeSize;
    }>;
    edges: Array<{
        id: CircuitEdgeId;
        from: CircuitNodePinId;
        to: CircuitNodePinId;
        waypoints: Waypoint | null;
    }>;
}
```

The data structure of `inputs` and `outputs` in nodes are array. The point to be mindful of here is the order of `CircuitNodePinId` is matter.
In addition, `CircuitNodePinId` is owned by nodes.

In case of simple nodes like AND or OR, the order is commonlly not particularly important.
But in case of complicated nodes like XOR, FF (NOT available currently), the order of `CircuitNodePinId` is important to impliment its action correctly.
And the actual difference of action by the order is implimented in each `CircuitNode` itself.

By parsing the data using `CircuitParserService`, we can get data called `CircuitGuiData` and `CircuitGraphData`.

## About CircuitGuiData

`CircuitGuiData` is used for GUI.
The following is the data for a GUI.

```ts
interface CircuitGuiData {
    nodes: Array<CircuitGuiNode>;
    edges: Array<CircuitGuiEdge>;
}

interface CircuitGuiNode {
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: Array<{ id: CircuitNodePinId; coordinate: Coordinate }>;
    outputs: Array<{ id: CircuitNodePinId; coordinate: Coordinate }>;
    coordinate: Coordinate;
    size: CircuitNodeSize;
}

interface CircuitGuiEdge {
    id: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    // Note: `waypoints` is converted from `Waypoint | null` in `CircuitData` to `Array<Coordinate>`.
    // A null value becomes an empty array.
    waypoints: Array<Coordinate>;
}

interface Coordinate {
  x: number;
  y: number;
}
```

`CircuitGuiEdge` completely depends on `CircuitGuiNode`.

When edges are rendered, edges try to find initial point and terminal point from `CircuitNodePinId`.
Then, they are renderd by the order of `initial point -> ...waypoints -> terminal point`.

Thus, the coordinates of initial point and terminal point are defined by the data of inouts and outputs in `CircuitGuiNode`.

## About CircuitGraph

`CircuitGraph` is used for emulation.
The following is the data for a emulation.

```ts
type CircuitGraphData = Array<CircuitGraphNode>;

interface CircuitGraphNode {
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: Array<CircuitNodeId>;
    outputs: Array<CircuitNodeId>;
}
```

`CircuitGraph` is parsed by cross-referencing the node and edge information from `CircuitData`.
This process is equivalent to reinterpreting the underlying data as a directed graph.

To build the `inputs` and `outputs` for a `CircuitGraphNode`, the parser analyzes the connections for each node.

For `inputs`, it finds all edges connected to the node's input pins. It then sorts these incoming edges based on the **index** of the connected pin in the original `CircuitData` node's `inputs` array (`Array<CircuitNodePinId>`). Finally, it maps these sorted edges to their source `CircuitNodeId`s to create the `inputs` array for the `CircuitGraphNode`.

A similar process is applied to `outputs`. The parser sorts the outgoing edges based on the **index** of the connected pin in the `outputs` array and maps them to their destination `CircuitNodeId`s.

Through this process, the direct `CircuitNodePinId` information is not stored in the `CircuitGraphNode`.
However, a crucial correspondence is maintained:

The **index** of a `CircuitNodeId` in the `CircuitGraphNode`'s `inputs` (or `outputs`) array directly corresponds to the **index** of the original `CircuitNodePinId` in the `CircuitData`'s `inputs` (or `outputs`) array.

This index-based mapping is essential. It allows the emulation logic for any `CircuitNode` to reliably distinguish between its connection points.
For example, it can treat the input at index `0` as a data line and the input at index `1` as a clock signal, which is critical for components like flip-flops.

For implementing more complex nodes like Flip-Flops or other sequential circuits, the following approach can be considered:

### Introduce concept of sub-graph

Instead of creating a new, complex node type within the emulation engine, we can add a feature to expand certain node types into a sub-graph of more fundamental nodes (like AND, OR, NOT, JUNCTION).

This approach would involve representing a complex node (e.g., a D-type Flip-Flop) as a pre-defined collection of simpler nodes and their interconnections.
The `CircuitParserService` would be responsible for replacing the complex node with its corresponding sub-graph during the parsing process.
The emulation engine would then operate on this expanded graph, without needing to know about the more complex node type. This keeps the core emulation logic simple and extensible.
