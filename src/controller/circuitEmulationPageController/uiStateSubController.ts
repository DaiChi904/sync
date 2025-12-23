"use client";

import { useCallback } from "react";
import type { CircuitEmulationPageUiStateModel } from "@/domain/model/controller/ICircuitEmulationPageController";

export interface UiStateSubControllerDeps {
    setUiState: <K extends keyof CircuitEmulationPageUiStateModel>(key: K, value: CircuitEmulationPageUiStateModel[K]) => void;
}

export const useUiStateSubController = ({
    setUiState,
}: UiStateSubControllerDeps) => {
    const openToolBarMenu = useCallback(
        (kind: "file" | "view" | "goTo" | "help") => {
            setUiState("toolBarMenu", { open: kind });
        },
        [setUiState],
    );

    const closeToolBarMenu = useCallback(() => {
        setUiState("toolBarMenu", { open: "none" });
    }, [setUiState]);

    const changeActivityBarMenu = useCallback(
        (kind: "evalMenu") => {
            setUiState("activityBarMenu", { open: kind });
        },
        [setUiState],
    );

    return {
        openToolBarMenu,
        closeToolBarMenu,
        changeActivityBarMenu,
    };
};
