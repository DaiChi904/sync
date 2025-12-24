import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import DiagramUtilityMenuBackdrop from "../../eventCaptureLayer/DiagramUtilityMenuBackdrop";
import NodeUtilityMenu from "../NodeUtilityMenu";

interface NodeMenuContentProps {
  at: Coordinate;
  focusedElement: { kind: "node"; value: CircuitGuiNode };
  viewBoxX?: number;
  viewBoxY?: number;
  closeUtilityMenu: () => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
}

export default function NodeMenuContent({
  at,
  focusedElement,
  viewBoxX,
  viewBoxY,
  closeUtilityMenu,
  deleteCircuitNode,
}: NodeMenuContentProps) {
  return (
    <>
      {/** biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
      <DiagramUtilityMenuBackdrop
        id="node-utility-menu-backdrop"
        viewBoxX={viewBoxX}
        viewBoxY={viewBoxY}
        onClick={closeUtilityMenu}
      />
      <NodeUtilityMenu
        at={at}
        menuOptions={[
          {
            label: "Delete",
            onClickController: () => {
              deleteCircuitNode(focusedElement.value.id);
              closeUtilityMenu();
            },
          },
        ]}
      />
    </>
  );
}
