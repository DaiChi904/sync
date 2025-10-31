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
To build the `inputs` for a `CircuitGraphNode`, the parser iterates through all `edges` in `CircuitData`, finds the edges connected to the node's input pins, and adds the source `CircuitNodeId` of those edges to the `inputs` array.
Because of this process, `CircuitNodePinId` information is lost, making it impossible to distinguish between input pins.
Additionally, the order of `inputs` in `CircuitGraphNode` (`Array<CircuitNodeId>`) is determined by the order of edges in `CircuitData` and is not guaranteed to be the same as the order of `inputs` in the original `CircuitData` node (`Array<CircuitNodePinId>`).

It is written that the order of `CircuitNodeId` in `CircuitData` is matter and important previously.
Currently, the emulation logic works well because there is only nodes which is evaluatable regardress of the difference evaluational meneings of input.
However, considering to add new node type like FF or other combinational circuits, modifing related logics is required.
There are two options for this.

### Option 1: Refactor `CircuitParserService`

Refactor `CircuitParserService` so that the order of `inputs` in `CircuitGraphNode` is guaranteed to be the same as the order of `inputs` in the original `CircuitData` node.
This would involve mapping `CircuitNodePinId` to its corresponding `CircuitNodeId` while preserving the order.

### Option 2: Introduce concept of sub-graph

In this approach, no changes for emulation engin. It add features to extend certain node type to fundamental node type of AND, OR, NOT, JUNCTION. This approach would involve representing complex nodes (like FF) as a sub-graph of simpler nodes. The emulation engine would then operate on this expanded graph. This would require a mechanism to translate the complex node into its sub-graph representation during parsing.
