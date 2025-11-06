import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/atoms/table";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

interface FormatSideBarProps {
  data: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
}

export default function FormatSideBar({ data }: FormatSideBarProps) {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: No need for unique id.
    <Flex id="format-side-bar" direction="column" style={{ maxWidth: "100%", height: "100%", padding: 5 }}>
      {!data ? (
        <Flex justifyContent="center" alignItems="center" grow={1}>
          <Typography>No data</Typography>
        </Flex>
      ) : data.kind === "node" ? (
        <>
          <Typography size="defaultPlus" style={{ textAlign: "center" }}>
            Node format
          </Typography>
          <Table style={{ display: "block", overflowX: "scroll", paddingTop: 5, paddingBottom: 10 }}>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Property</TableHeaderCell>
                <TableHeaderCell>Value</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{data.value.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{data.value.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Size</TableCell>
                <TableCell>
                  {data.value.size.x} * {data.value.size.y}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Coordinate</TableCell>
                <TableCell>
                  {data.value.coordinate.x} * {data.value.coordinate.y}
                </TableCell>
              </TableRow>
              {data.value.inputs.length > 0 ? (
                data.value.inputs.map((input, idx) => (
                  <TableRow key={input.id}>
                    {idx === 0 && <TableCell rowSpan={data.value.inputs.length}>Input</TableCell>}
                    <TableCell>{input.id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Input</TableCell>
                  <TableCell>No inputs</TableCell>
                </TableRow>
              )}
              {data.value.outputs.length > 0 ? (
                data.value.outputs.map((output, idx) => (
                  <TableRow key={output.id}>
                    {idx === 0 && <TableCell rowSpan={data.value.outputs.length}>output</TableCell>}
                    <TableCell>{output.id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Output</TableCell>
                  <TableCell>No outputs</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <Typography size="defaultPlus" style={{ textAlign: "center" }}>
            Edge format
          </Typography>
          <Table style={{ display: "block", overflowX: "scroll", paddingTop: 5, paddingBottom: 10 }}>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Property</TableHeaderCell>
                <TableHeaderCell>Value</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{data.value.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>{data.value.from}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>To</TableCell>
                <TableCell>{data.value.to}</TableCell>
              </TableRow>

              {data.value.waypoints.length > 0 ? (
                data.value.waypoints.map((waypoint, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: This is fine.
                  <TableRow key={idx}>
                    <TableCell>Waypoints {idx + 1}</TableCell>
                    <TableCell>
                      {waypoint.x} * {waypoint.y}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Waypoints</TableCell>
                  <TableCell>No waypoints</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </Flex>
  );
}
