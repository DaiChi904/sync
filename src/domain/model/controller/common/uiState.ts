/**
 * Common UI state types shared across multiple page controllers
 */

export interface ToolBarMenuState {
  open: "none" | "file" | "view" | "goTo" | "help";
}

export const initialToolBarMenuState: ToolBarMenuState = {
  open: "none",
};

export interface CircuitActivityBarMenuState {
  open: "infomation" | "circuitDiagram" | "rowCircuitData";
}

export interface EmulationActivityBarMenuState {
  open: "evalMenu";
}

import type { Coordinate } from "@/domain/model/valueObject/coordinate";

export interface DiagramUtilityMenuState {
  open: "none" | "edge" | "node";
  at: Coordinate | null;
}
export const initialDiagramUtilityMenuState: DiagramUtilityMenuState = {
  open: "none",
  at: null,
};
