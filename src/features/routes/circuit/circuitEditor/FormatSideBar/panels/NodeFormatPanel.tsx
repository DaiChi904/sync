import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/atoms/table";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

interface NodeFormatPanelProps {
  node: CircuitGuiNode;
}

export default function NodeFormatPanel({ node }: NodeFormatPanelProps) {
  return (
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
            <TableCell>{node.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>{node.type}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Size</TableCell>
            <TableCell>
              {node.size.x} * {node.size.y}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coordinate</TableCell>
            <TableCell>
              {node.coordinate.x} * {node.coordinate.y}
            </TableCell>
          </TableRow>
          {node.inputs.length > 0 ? (
            node.inputs.map((input, idx) => (
              <TableRow key={input.id}>
                {idx === 0 && <TableCell rowSpan={node.inputs.length}>Input</TableCell>}
                <TableCell>{input.id}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>Input</TableCell>
              <TableCell>No inputs</TableCell>
            </TableRow>
          )}
          {node.outputs.length > 0 ? (
            node.outputs.map((output, idx) => (
              <TableRow key={output.id}>
                {idx === 0 && <TableCell rowSpan={node.outputs.length}>output</TableCell>}
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
  );
}
