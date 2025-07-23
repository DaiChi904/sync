import { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";

export const mockCircuitData: Array<Circuit> = [
  Circuit.from({
    id: CircuitId.from("sr-latch-circuit-01"),
    title: CircuitTitle.from("SRラッチ"),
    description: CircuitDescription.from(
      "【正しさが保証されているデータです】単純なSRラッチ回路です。セット(S)とリセット(R)の2つの入力を持ち、QとQ_の2つの出力を持ちます。",
    ),
    circuitData: CircuitData.from(`
    Node, S, ENTRY, [NONE], [S_output0], [50:50], [60:40];
    Node, R, ENTRY, [NONE], [R_output0], [50:150], [60:40];
    Node, NOT1, NOT, [NOT1_input0], [NOT1_output0], [150:50], [60:40];
    Node, NOT2, NOT, [NOT2_input0], [NOT2_output0], [150:150], [60:40];
    Node, AND1, AND, [AND1_input0 | AND1_input1], [AND1_output0], [250:50], [60:40];
    Node, NOT3, NOT, [NOT3_input0], [NOT3_output0], [350:50], [60:40];
    Node, JUNCTION1, JUNCTION, [JUNCTION1_input0], [JUNCTION1_output0 | JUNCTION1_output1], [450:50], [60:40];
    Node, AND2, AND, [AND2_input0 | AND2_input1], [AND2_output0], [250:150], [60:40];
    Node, NOT4, NOT, [NOT4_input0], [NOT4_output0], [350:150], [60:40];
    Node, JUNCTION2, JUNCTION, [JUNCTION2_input0], [JUNCTION2_output0 | JUNCTION2_output1], [450:150], [60:40];
    Node, Q, EXIT, [Q_input0], [NONE], [550:50], [60:40];
    Node, Q_, EXIT, [Q__input0], [NONE], [550:150], [60:40];
    Edge, edge_0, [S_output0 -> NOT1_input0], [NONE];
    Edge, edge_1, [R_output0 -> NOT2_input0], [NONE];
    Edge, edge_2, [NOT1_output0 -> AND1_input0], [NONE];
    Edge, edge_3, [NOT2_output0 -> AND2_input0], [NONE];
    Edge, edge_4, [JUNCTION2_output0 -> AND1_input1], [NONE];
    Edge, edge_5, [AND1_output0 -> NOT3_input0], [NONE];
    Edge, edge_6, [NOT3_output0 -> JUNCTION1_input0], [NONE];
    Edge, edge_7, [JUNCTION1_output0 -> AND2_input1], [NONE];
    Edge, edge_8, [JUNCTION1_output1 -> Q_input0], [NONE];
    Edge, edge_9, [AND2_output0 -> NOT4_input0], [NONE];
    Edge, edge_10, [NOT4_output0 -> JUNCTION2_input0], [NONE];
    Edge, edge_11, [JUNCTION2_output1 -> Q__input0], [NONE];
    `),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T11:30:00Z")),
  }),
  Circuit.from({
    id: CircuitId.from("or-circuit-01"),
    title: CircuitTitle.from("OR回路"),
    description: CircuitDescription.from("【正しさが保証されていないデータです】2入力のOR回路です。"),
    circuitData: CircuitData.from(`
    Node, A, ENTRY, [], [A_output0], [50:50], [60:40];
    Node, B, ENTRY, [], [B_output0], [50:150], [60:40];
    Node, OR1, OR, [OR1_input0 | OR1_input1], [OR1_output0], [200:100], [60:40];
    Node, OUT, EXIT, [OUT_input0], [], [350:100], [60:40];
    Edge, edge_0, [A_output0 -> OR1_input0], [NONE];
    Edge, edge_1, [B_output0 -> OR1_input1], [NONE];
    Edge, edge_2, [OR1_output0 -> OUT_input0], [NONE];
  `),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T11:00:00Z")),
  }),
  Circuit.from({
    id: CircuitId.from("nand-latch-circuit-01"),
    title: CircuitTitle.from("NANDラッチ"),
    description: CircuitDescription.from("【正しさが保証されていないデータです】NANDゲートを使ったSRラッチ回路です。"),
    circuitData: CircuitData.from(`
    Node, S, ENTRY, [], [S_output0], [50:50], [60:40];
    Node, R, ENTRY, [], [R_output0], [50:150], [60:40];
    Node, NAND1, NAND, [NAND1_input0 | NAND1_input1], [NAND1_output0], [200:50], [60:40];
    Node, NAND2, NAND, [NAND2_input0 | NAND2_input1], [NAND2_output0], [200:150], [60:40];
    Node, Q, EXIT, [Q_input0], [], [350:50], [60:40];
    Node, Q_, EXIT, [Q__input0], [], [350:150], [60:40];
    Edge, edge_0, [S_output0 -> NAND1_input0], [NONE];
    Edge, edge_1, [R_output0 -> NAND2_input1], [NONE];
    Edge, edge_2, [NAND1_output0 -> Q_input0], [NONE];
    Edge, edge_3, [NAND2_output0 -> Q__input0], [NONE];
    Edge, edge_4, [NAND1_output0 -> NAND2_input0], [NONE];
    Edge, edge_5, [NAND2_output0 -> NAND1_input1], [NONE];
  `),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T11:45:00Z")),
  }),
  Circuit.from({
    id: CircuitId.from("t-flipflop-circuit-01"),
    title: CircuitTitle.from("Tフリップフロップ"),
    description: CircuitDescription.from(
      "【正しさが保証されていないデータです】T入力でトグル動作するフリップフロップの簡易モデル。",
    ),
    circuitData: CircuitData.from(`
    Node, T, ENTRY, [], [T_output0], [50:100], [60:40];
    Node, CLK, ENTRY, [], [CLK_output0], [50:200], [60:40];
    Node, NAND1, NAND, [NAND1_input0 | NAND1_input1], [NAND1_output0], [200:100], [60:40];
    Node, NAND2, NAND, [NAND2_input0 | NAND2_input1], [NAND2_output0], [200:200], [60:40];
    Node, Q, EXIT, [Q_input0], [], [350:100], [60:40];
    Node, Q_, EXIT, [Q__input0], [], [350:200], [60:40];
    Edge, edge_0, [T_output0 -> NAND1_input0], [NONE];
    Edge, edge_1, [CLK_output0 -> NAND1_input1], [NONE];
    Edge, edge_2, [NAND1_output0 -> NAND2_input0], [NONE];
    Edge, edge_3, [NAND2_output0 -> NAND1_input1], [NONE];
    Edge, edge_4, [NAND2_output0 -> Q__input0], [NONE];
    Edge, edge_5, [NAND1_output0 -> Q_input0], [NONE];
  `),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T12:00:00Z")),
  }),
  Circuit.from({
    id: CircuitId.from("full-adder-circuit-01"),
    title: CircuitTitle.from("全加算器"),
    description: CircuitDescription.from(
      "【正しさが保証されているデータです】3入力の全加算器です。入力としてM, S, Bを持ちます",
    ),
    circuitData: CircuitData.from(`
      Node, A, ENTRY, [NONE], [A_output0], [50:50], [60:40];
      Node, B, ENTRY, [NONE], [B_output0], [50:150], [60:40];
      Node, Cin, ENTRY, [NONE], [Cin_output0], [50:250], [60:40];
      Node, JUNC_A, JUNCTION, [JUNC_A_input0], [JUNC_A_output0 | JUNC_A_output1 | JUNC_A_output2], [100:50], [60:40];
      Node, JUNC_B, JUNCTION, [JUNC_B_input0], [JUNC_B_output0 | JUNC_B_output1 | JUNC_B_output2], [100:150], [60:40];
      Node, JUNC_Cin, JUNCTION, [JUNC_Cin_input0], [JUNC_Cin_output0 | JUNC_Cin_output1 | JUNC_Cin_output2], [100:250], [60:40];
      Node, NOT_A, NOT, [NOT_A_input0], [NOT_A_output0], [150:30], [60:40];
      Node, NOT_B, NOT, [NOT_B_input0], [NOT_B_output0], [150:130], [60:40];
      Node, NOT_Cin, NOT, [NOT_Cin_input0], [NOT_Cin_output0], [150:230], [60:40];
      Node, A_AND_NOT_B, AND, [A_AND_NOT_B_input0 | A_AND_NOT_B_input1], [A_AND_NOT_B_output0], [250:30], [60:40];
      Node, NOT_A_AND_B, AND, [NOT_A_AND_B_input0 | NOT_A_AND_B_input1], [NOT_A_AND_B_output0], [250:130], [60:40];
      Node, A_XOR_B, OR, [A_XOR_B_input0 | A_XOR_B_input1], [A_XOR_B_output0], [350:80], [60:40];
      Node, JUNC_AXORB, JUNCTION, [JUNC_AXORB_input0], [JUNC_AXORB_output0 | JUNC_AXORB_output1 | JUNC_AXORB_output2], [400:80], [60:40];
      Node, NOT_AXORB, NOT, [NOT_AXORB_input0], [NOT_AXORB_output0], [450:50], [60:40];
      Node, AXORB_AND_NOT_Cin, AND, [AXORB_AND_NOT_Cin_input0 | AXORB_AND_NOT_Cin_input1], [AXORB_AND_NOT_Cin_output0], [550:30], [60:40];
      Node, NOT_AXORB_AND_Cin, AND, [NOT_AXORB_AND_Cin_input0 | NOT_AXORB_AND_Cin_input1], [NOT_AXORB_AND_Cin_output0], [550:130], [60:40];
      Node, SUM, OR, [SUM_input0 | SUM_input1], [SUM_output0], [650:80], [60:40];
      Node, A_AND_B, AND, [A_AND_B_input0 | A_AND_B_input1], [A_AND_B_output0], [250:230], [60:40];
      Node, Cin_AND_AXORB, AND, [Cin_AND_AXORB_input0 | Cin_AND_AXORB_input1], [Cin_AND_AXORB_output0], [450:230], [60:40];
      Node, Curry, OR, [Curry_input0 | Curry_input1], [Curry_output0], [550:230], [60:40];
      Node, SumOut, EXIT, [SumOut_input0], [NONE], [750:80], [60:40];
      Node, CurryOut, EXIT, [CurryOut_input0], [NONE], [650:230], [60:40];
      Edge, e0, [A_output0 -> JUNC_A_input0], [NONE];
      Edge, e1, [JUNC_A_output0 -> NOT_A_input0], [NONE];
      Edge, e2, [JUNC_A_output1 -> A_AND_NOT_B_input0], [NONE];
      Edge, e3, [JUNC_A_output2 -> A_AND_B_input0], [NONE];
      Edge, e4, [B_output0 -> JUNC_B_input0], [NONE];
      Edge, e5, [JUNC_B_output0 -> NOT_B_input0], [NONE];
      Edge, e6, [JUNC_B_output1 -> NOT_A_AND_B_input1], [NONE];
      Edge, e7, [JUNC_B_output2 -> A_AND_B_input1], [NONE];
      Edge, e8, [Cin_output0 -> JUNC_Cin_input0], [NONE];
      Edge, e9, [JUNC_Cin_output0 -> NOT_Cin_input0], [NONE];
      Edge, e10, [JUNC_Cin_output1 -> NOT_AXORB_AND_Cin_input1], [NONE];
      Edge, e11, [JUNC_Cin_output2 -> Cin_AND_AXORB_input0], [NONE];
      Edge, e12, [NOT_A_output0 -> NOT_A_AND_B_input0], [NONE];
      Edge, e13, [NOT_B_output0 -> A_AND_NOT_B_input1], [NONE];
      Edge, e14, [A_AND_NOT_B_output0 -> A_XOR_B_input0], [NONE];
      Edge, e15, [NOT_A_AND_B_output0 -> A_XOR_B_input1], [NONE];
      Edge, e16, [A_XOR_B_output0 -> JUNC_AXORB_input0], [NONE];
      Edge, e17, [JUNC_AXORB_output0 -> NOT_AXORB_input0], [NONE];
      Edge, e18, [JUNC_AXORB_output1 -> AXORB_AND_NOT_Cin_input0], [NONE];
      Edge, e19, [JUNC_AXORB_output2 -> Cin_AND_AXORB_input1], [NONE];
      Edge, e20, [NOT_Cin_output0 -> AXORB_AND_NOT_Cin_input1], [NONE];
      Edge, e21, [NOT_AXORB_output0 -> NOT_AXORB_AND_Cin_input0], [NONE];
      Edge, e22, [AXORB_AND_NOT_Cin_output0 -> SUM_input0], [NONE];
      Edge, e23, [NOT_AXORB_AND_Cin_output0 -> SUM_input1], [NONE];
      Edge, e24, [SUM_output0 -> SumOut_input0], [NONE];
      Edge, e25, [A_AND_B_output0 -> Curry_input0], [NONE];
      Edge, e26, [Cin_AND_AXORB_output0 -> Curry_input1], [NONE];
      Edge, e27, [Curry_output0 -> CurryOut_input0], [NONE];
  `),
    createdAt: CreatedDateTime.fromDate(new Date("2023-10-26T10:00:00Z")),
    updatedAt: UpdatedDateTime.fromDate(new Date("2023-10-26T12:00:00Z")),
  }),
];
