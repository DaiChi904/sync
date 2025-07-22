import Box from "@/components/atoms/Box";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import Typography from "@/components/atoms/Typography";
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { Coordinate } from "@/domain/model/valueObject/coordinate";

interface CircuitEditorProps {
  circuitEditorData:
    | {
        node: Array<{
          type: "Node";
          nodeId: CircuitNodeId;
          nodeType: CircuitNodeType;
          inputs: CircuitNodePinId[];
          outputs: CircuitNodePinId[];
          coordinate: Coordinate;
          size: CircuitNodeSize;
        }>;
        edge: Array<{
          type: "Edge";
          edgeId: CircuitEdgeId;
          from: CircuitNodePinId;
          to: CircuitNodePinId;
          waypoints: Coordinate[];
        }>;
      }
    | undefined;
  save: () => void;
  addCircuitNode: (newNode: {
    type: "Node";
    nodeId: CircuitNodeId;
    nodeType: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  updateCircuitNode: (newNode: {
    type: "Node";
    nodeId: CircuitNodeId;
    nodeType: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
  addCircuitEdge: (newEdge: {
    type: "Edge";
    edgeId: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Coordinate[];
  }) => void;
  updateCircuitEdge: (newEdge: {
    type: "Edge";
    edgeId: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Coordinate[];
  }) => void;
  deleteCircuitEdge: (nodeId: CircuitEdgeId) => void;
}

export default function CircuitEditor({
  circuitEditorData,
  save,
  addCircuitNode,
  updateCircuitNode,
  deleteCircuitNode,
  addCircuitEdge,
  updateCircuitEdge,
  deleteCircuitEdge,
}: CircuitEditorProps) {
  const nodes = circuitEditorData?.node;
  const edges = circuitEditorData?.edge;

  return (
    <Box className="p-4 space-y-8">
      <Box className="animated" onClick={save}>
        Save
      </Box>
      <Box>
        <Typography className="font-bold" size="large">
          Nodes
        </Typography>
        <Flex direction="column" gap={5}>
          <Grid xs={1} ys={1} xfs={8} yfs={1} container gap={5}>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Type
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Id
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Type
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Inputs
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Outputs
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Coordinate
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Size
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Actions
            </Grid>
          </Grid>
          {nodes?.map((node) => (
            <Grid key={node.nodeId} xs={1} ys={1} xfs={8} yfs={1} container gap={5}>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                {node.type}
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                {node.nodeId}
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <select
                  defaultValue={node.nodeType}
                  onChange={(ev) => {
                    node.nodeType = ev.target.value as CircuitNodeType;
                  }}
                >
                  <option value="ENTRY">ENTRY</option>
                  <option value="EXIT">EXIT</option>
                  <option value="JUNCTION">JUNCTION</option>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="NOT">NOT</option>
                </select>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Flex direction="column">
                  {node.inputs.map((input, idx) => (
                    <Box key={input}>
                      <Flex style={{ display: "flex", width: "100%" }}>
                        <input
                          key={input}
                          type="text"
                          style={{ width: "80%" }}
                          defaultValue={input}
                          onChange={(ev) => {
                            node.inputs[idx] = CircuitNodePinId.from(ev.target.value);
                          }}
                        />
                        <Flex
                          style={{ width: "20%", fontSize: "10px", margin: "1px" }}
                          onClick={() => {
                            node.inputs = node.inputs.filter((_, oldIdx) => oldIdx !== idx);
                            updateCircuitNode({ ...node });
                          }}
                          className="animated"
                        >
                          Delete
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                  <Box
                    onClick={() => {
                      node.inputs.push(CircuitNodePinId.from("new_input"));
                      updateCircuitNode({ ...node });
                    }}
                    className="animated"
                  >
                    Add
                  </Box>
                </Flex>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Flex direction="column">
                  {node.outputs.map((output, idx) => (
                    <Box key={output}>
                      <Flex style={{ display: "flex", width: "100%" }}>
                        <input
                          key={output}
                          type="text"
                          style={{ width: "80%" }}
                          defaultValue={output}
                          onChange={(ev) => {
                            node.outputs[idx] = CircuitNodePinId.from(ev.target.value);
                          }}
                        />
                        <Flex
                          style={{ width: "20%", fontSize: "10px", margin: "1px" }}
                          onClick={() => {
                            node.outputs = node.outputs.filter((_, oldIdx) => oldIdx !== idx);
                            updateCircuitNode({ ...node });
                          }}
                          className="animated"
                        >
                          Delete
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                  <Box
                    onClick={() => {
                      node.outputs.push(CircuitNodePinId.from("new_input"));
                      updateCircuitNode({ ...node });
                    }}
                    className="animated"
                  >
                    Add
                  </Box>
                </Flex>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Flex direction="column">
                  <input
                    type="text"
                    defaultValue={node.coordinate.x}
                    onChange={(ev) => {
                      node.coordinate.x = Number(ev.target.value);
                    }}
                  />
                  <input
                    type="text"
                    defaultValue={node.coordinate.y}
                    onChange={(ev) => {
                      node.coordinate.y = Number(ev.target.value);
                    }}
                  />
                </Flex>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Flex direction="column">
                  <input
                    type="text"
                    defaultValue={node.size.x}
                    onChange={(ev) => {
                      node.size.x = Number(ev.target.value);
                    }}
                  />
                  <input
                    type="text"
                    defaultValue={node.size.y}
                    onChange={(ev) => {
                      node.size.y = Number(ev.target.value);
                    }}
                  />
                </Flex>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Box onClick={() => updateCircuitNode({ ...node })} className="animated">
                  Update
                </Box>
                <Box onClick={() => deleteCircuitNode(node.nodeId)} className="animated">
                  Delete
                </Box>
              </Grid>
            </Grid>
          ))}
          <Box
            onClick={() => {
              addCircuitNode({
                type: "Node",
                nodeId: CircuitNodeId.from("new_node"),
                nodeType: CircuitNodeType.from("ENTRY"),
                inputs: [],
                outputs: [],
                coordinate: Coordinate.from({ x: 0, y: 0 }),
                size: CircuitNodeSize.from({ x: 0, y: 0 }),
              });
            }}
            className="animated"
          >
            Add
          </Box>
        </Flex>
      </Box>

      <Box>
        <Typography className="font-bold" size="large">
          Edges
        </Typography>
        <Flex direction="column" gap={5}>
          <Grid xs={1} ys={1} xfs={6} yfs={1} container gap={5}>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Type
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Id
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              From
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              To
            </Grid>
            <Grid xs={1} ys={1} xfs={1} yfs={1}>
              Waypoints
            </Grid>
          </Grid>
          {edges?.map((edge) => (
            <Grid key={edge.edgeId} xs={1} ys={1} xfs={6} yfs={1} container gap={5}>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                {edge.type}
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <input
                  type="text"
                  defaultValue={edge.edgeId}
                  onChange={(ev) => {
                    edge.edgeId = CircuitEdgeId.from(ev.target.value);
                  }}
                />
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <input
                  type="text"
                  defaultValue={edge.from}
                  onChange={(ev) => {
                    edge.from = CircuitNodePinId.from(ev.target.value);
                  }}
                />
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <input
                  type="text"
                  defaultValue={edge.to}
                  onChange={(ev) => {
                    edge.to = CircuitNodePinId.from(ev.target.value);
                  }}
                />
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Flex direction="row">
                  {edge.waypoints?.map((point, idx) => (
                    <>
                      <Flex key={point.x + point.y} direction="column" style={{ display: "flex", width: "100%" }}>
                        <input
                          type="text"
                          defaultValue={point.x}
                          onChange={(ev) => {
                            point.x = Number(ev.target.value);
                            edge.waypoints[idx] = point;
                          }}
                        />
                        <input
                          type="text"
                          defaultValue={point.y}
                          onChange={(ev) => {
                            point.y = Number(ev.target.value);
                            edge.waypoints[idx] = point;
                          }}
                        />
                      </Flex>
                      <Flex
                        style={{ width: "20%", fontSize: "10px", margin: "1px" }}
                        onClick={() => {
                          edge.waypoints = edge.waypoints.filter((_, oldIdx) => oldIdx !== idx);
                          updateCircuitEdge({ ...edge });
                        }}
                        className="animated"
                      >
                        Delete
                      </Flex>
                    </>
                  ))}
                  <Box
                    onClick={() => {
                      console.log("not implemented yet");
                    }}
                    className="animated"
                  >
                    Add (Not implemented yet)
                  </Box>
                </Flex>
              </Grid>
              <Grid xs={1} ys={1} xfs={1} yfs={1}>
                <Box onClick={() => updateCircuitEdge({ ...edge })} className="animated">
                  Update
                </Box>
                <Box onClick={() => deleteCircuitEdge(edge.edgeId)} className="animated">
                  Delete
                </Box>
              </Grid>
            </Grid>
          ))}
          <Box
            onClick={() => {
              addCircuitEdge({
                type: "Edge",
                edgeId: CircuitEdgeId.from("new_edge"),
                from: CircuitNodePinId.from("new_edge"),
                to: CircuitNodePinId.from("new_edge"),
                waypoints: [],
              });
            }}
            className="animated"
          >
            Add
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
