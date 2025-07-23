import { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";

export const mockCircuitData: Array<Circuit> = [
  Circuit.from({
    id: CircuitId.from("sr-latch-circuit-01"),
    title: CircuitTitle.from("SRラッチ"),
    description: CircuitDescription.from(
      "【正しさが保証されているデータです】単純なSRラッチ回路です。セット(S)とリセット(R)の2つの入力を持ち、QとQ_の2つの出力を持ちます。",
    ),
    circuitData: CircuitData.from({
      nodes: [
        {
          id: CircuitNodeId.from("S"),
          type: CircuitNodeType.from("ENTRY"),
          inputs: [],
          outputs: [CircuitNodePinId.from("S_output0")],
          coordinate: Coordinate.from({ x: 50, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("R"),
          type: CircuitNodeType.from("ENTRY"),
          inputs: [],
          outputs: [CircuitNodePinId.from("R_output0")],
          coordinate: Coordinate.from({ x: 50, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("NOT1"),
          type: CircuitNodeType.from("NOT"),
          inputs: [CircuitNodePinId.from("NOT1_input0")],
          outputs: [CircuitNodePinId.from("NOT1_output0")],
          coordinate: Coordinate.from({ x: 150, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("NOT2"),
          type: CircuitNodeType.from("NOT"),
          inputs: [CircuitNodePinId.from("NOT2_input0")],
          outputs: [CircuitNodePinId.from("NOT2_output0")],
          coordinate: Coordinate.from({ x: 150, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("AND1"),
          type: CircuitNodeType.from("AND"),
          inputs: [CircuitNodePinId.from("AND1_input0"), CircuitNodePinId.from("AND1_input1")],
          outputs: [CircuitNodePinId.from("AND1_output0")],
          coordinate: Coordinate.from({ x: 250, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("NOT3"),
          type: CircuitNodeType.from("NOT"),
          inputs: [CircuitNodePinId.from("NOT3_input0")],
          outputs: [CircuitNodePinId.from("NOT3_output0")],
          coordinate: Coordinate.from({ x: 350, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("JUNCTION1"),
          type: CircuitNodeType.from("JUNCTION"),
          inputs: [CircuitNodePinId.from("JUNCTION1_input0")],
          outputs: [CircuitNodePinId.from("JUNCTION1_output0"), CircuitNodePinId.from("JUNCTION1_output1")],
          coordinate: Coordinate.from({ x: 450, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("AND2"),
          type: CircuitNodeType.from("AND"),
          inputs: [CircuitNodePinId.from("AND2_input0"), CircuitNodePinId.from("AND2_input1")],
          outputs: [CircuitNodePinId.from("AND2_output0")],
          coordinate: Coordinate.from({ x: 250, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("NOT4"),
          type: CircuitNodeType.from("NOT"),
          inputs: [CircuitNodePinId.from("NOT4_input0")],
          outputs: [CircuitNodePinId.from("NOT4_output0")],
          coordinate: Coordinate.from({ x: 350, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("JUNCTION2"),
          type: CircuitNodeType.from("JUNCTION"),
          inputs: [CircuitNodePinId.from("JUNCTION2_input0")],
          outputs: [CircuitNodePinId.from("JUNCTION2_output0"), CircuitNodePinId.from("JUNCTION2_output1")],
          coordinate: Coordinate.from({ x: 450, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("Q"),
          type: CircuitNodeType.from("EXIT"),
          inputs: [CircuitNodePinId.from("Q_input0")],
          outputs: [],
          coordinate: Coordinate.from({ x: 550, y: 50 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
        {
          id: CircuitNodeId.from("Q_"),
          type: CircuitNodeType.from("EXIT"),
          inputs: [CircuitNodePinId.from("Q__input0")],
          outputs: [],
          coordinate: Coordinate.from({ x: 550, y: 150 }),
          size: CircuitNodeSize.from({ x: 60, y: 40 }),
        },
      ],
      edges: [
        {
          id: CircuitEdgeId.from("edge_0"),
          from: CircuitNodePinId.from("S_output0"),
          to: CircuitNodePinId.from("NOT1_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_1"),
          from: CircuitNodePinId.from("R_output0"),
          to: CircuitNodePinId.from("NOT2_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_2"),
          from: CircuitNodePinId.from("NOT1_output0"),
          to: CircuitNodePinId.from("AND1_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_3"),
          from: CircuitNodePinId.from("NOT2_output0"),
          to: CircuitNodePinId.from("AND2_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_4"),
          from: CircuitNodePinId.from("JUNCTION2_output0"),
          to: CircuitNodePinId.from("AND1_input1"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_5"),
          from: CircuitNodePinId.from("AND1_output0"),
          to: CircuitNodePinId.from("NOT3_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_6"),
          from: CircuitNodePinId.from("NOT3_output0"),
          to: CircuitNodePinId.from("JUNCTION1_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_7"),
          from: CircuitNodePinId.from("JUNCTION1_output0"),
          to: CircuitNodePinId.from("AND2_input1"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_8"),
          from: CircuitNodePinId.from("JUNCTION1_output1"),
          to: CircuitNodePinId.from("Q_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_9"),
          from: CircuitNodePinId.from("AND2_output0"),
          to: CircuitNodePinId.from("NOT4_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_10"),
          from: CircuitNodePinId.from("NOT4_output0"),
          to: CircuitNodePinId.from("JUNCTION2_input0"),
          waypoints: null,
        },
        {
          id: CircuitEdgeId.from("edge_11"),
          from: CircuitNodePinId.from("JUNCTION2_output1"),
          to: CircuitNodePinId.from("Q__input0"),
          waypoints: null,
        },
      ],
    }),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T11:30:00Z")),
  }),
];
