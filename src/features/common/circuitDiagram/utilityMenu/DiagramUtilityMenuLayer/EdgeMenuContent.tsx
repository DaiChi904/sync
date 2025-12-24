import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import DiagramUtilityMenuBackdrop from "../../eventCaptureLayer/DiagramUtilityMenuBackdrop";
import EdgeUtilityMenu from "../EdgeUtilityMenu";

interface EdgeMenuContentProps {
  at: Coordinate;
  focusedElement: { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } };
  viewBoxX?: number;
  viewBoxY?: number;
  closeUtilityMenu: () => void;
  deleteCircuitEdge: (edgeId: CircuitEdgeId) => void;
  addEdgeWaypoint: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
  deleteEdgeWaypoint: (id: CircuitEdgeId) => (index: number) => void;
}

export default function EdgeMenuContent({
  at,
  focusedElement,
  viewBoxX,
  viewBoxY,
  closeUtilityMenu,
  deleteCircuitEdge,
  addEdgeWaypoint,
  deleteEdgeWaypoint,
}: EdgeMenuContentProps) {
  return (
    <>
      {/** biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
      <DiagramUtilityMenuBackdrop
        id="edge-utility-menu-backdrop"
        viewBoxX={viewBoxX}
        viewBoxY={viewBoxY}
        onClick={closeUtilityMenu}
      />
      <EdgeUtilityMenu
        at={at}
        menuOptions={[
          {
            label: "Delete",
            onClickController: () => {
              deleteCircuitEdge(focusedElement.value.id);
              closeUtilityMenu();
            },
          },
          {
            label: "Add Waypoint",
            onClickController: () => {
              addEdgeWaypoint(focusedElement.value.id)(at, focusedElement.value.waypointIdx);
              closeUtilityMenu();
            },
          },
          {
            label: "Delete Waypoint",
            onClickController: () => {
              deleteEdgeWaypoint(focusedElement.value.id)(focusedElement.value.waypointIdx);
              closeUtilityMenu();
            },
          },
        ]}
      />
    </>
  );
}
