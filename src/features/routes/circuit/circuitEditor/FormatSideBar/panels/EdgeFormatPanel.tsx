import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/atoms/table";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";

interface EdgeFormatPanelProps {
  edge: CircuitGuiEdge;
}

export default function EdgeFormatPanel({ edge }: EdgeFormatPanelProps) {
  return (
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
            <TableCell>{edge.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>{edge.from}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>To</TableCell>
            <TableCell>{edge.to}</TableCell>
          </TableRow>

          {edge.waypoints.length > 0 ? (
            edge.waypoints.map((waypoint, idx) => (
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
  );
}
