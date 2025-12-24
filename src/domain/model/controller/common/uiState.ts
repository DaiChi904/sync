/**
 * Common UI state types shared across multiple page controllers
 */

/** Toolbar menu state - common across circuit pages */
export interface ToolBarMenuState {
  open: "none" | "file" | "view" | "goTo" | "help";
}

/** Initial state for ToolBarMenu */
export const initialToolBarMenuState: ToolBarMenuState = {
  open: "none",
};

/** Activity bar menu state for circuit editor/view pages */
export interface CircuitActivityBarMenuState {
  open: "infomation" | "circuitDiagram" | "rowCircuitData";
}

/** Activity bar menu state for emulation page */
export interface EmulationActivityBarMenuState {
  open: "evalMenu";
}

import type { Coordinate } from "@/domain/model/valueObject/coordinate";

/** Diagram utility menu state (right-click menu) */
export interface DiagramUtilityMenuState {
  open: "none" | "edge" | "node";
  at: Coordinate | null;
}

/** Initial state for DiagramUtilityMenu */
export const initialDiagramUtilityMenuState: DiagramUtilityMenuState = {
  open: "none",
  at: null,
};
