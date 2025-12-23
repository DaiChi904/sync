"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    CircuitEditorPageControllerError,
    type CircuitEditorPageErrorModel,
    type CircuitEditorPageUiStateModel,
    type ICircuitEditorPageController,
    initialCircuitEditorPageError,
} from "@/domain/model/controller/ICircuitEditorPageController";
import type { ICircuitRepository } from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IDeleteCircuitUsecase } from "@/domain/model/usecase/IDeleteCircuitUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { IUpdateCircuitUsecase } from "@/domain/model/usecase/IUpdateCircuitUsecase";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { useCircuitDiagram } from "@/hooks/circuitDiagram";
import { usePartialState } from "@/hooks/partialState";
import { useViewBox } from "@/hooks/viewBox";
import { useCircuitDataSubController } from "./circuitDataSubController";
import { useNodeDragSubController } from "./nodeDragSubController";
import { useEdgeDragSubController } from "./edgeDragSubController";

export interface CircuitEditorPageControllerDependencies {
    query: CircuitId;
    getCircuitDetailUsecase: IGetCircuitDetailUsecase;
    circuitParserUsecase: ICircuitParserService;
    updateCircuitUsecase: IUpdateCircuitUsecase;
    deleteCircuitUsecase: IDeleteCircuitUsecase;
    circuitRepository: ICircuitRepository;
}

export const useCircuitEditorPageController = ({
    query,
    getCircuitDetailUsecase,
    circuitParserUsecase,
    updateCircuitUsecase,
    deleteCircuitUsecase,
}: CircuitEditorPageControllerDependencies): ICircuitEditorPageController => {
    const router = useRouter();

    const [error, setError] = usePartialState<CircuitEditorPageErrorModel>(initialCircuitEditorPageError);
    const [uiState, setUiState] = usePartialState<CircuitEditorPageUiStateModel>({
        diagramUtilityMenu: { open: "none", at: null },
        toolBarMenu: { open: "none" },
        activityBarMenu: { open: "infomation" },
    });

    const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);

    const {
        isViewBoxInitialized,
        viewBox,
        circuitDiagramContainerRef,
        circuitDiagramSvgRef,
        panningRef,
        initViewBox,
        getSvgCoords,
        handleViewBoxMouseDown,
        handleViewBoxMouseMove,
        handleViewBoxMouseUp,
        handleViewBoxZoom,
        preventBrowserZoom,
    } = useCircuitDiagram(useViewBox());

    // Circuit Data Sub-Controller
    const circuitData = useCircuitDataSubController({
        query,
        getCircuitDetailUsecase,
        updateCircuitUsecase,
        deleteCircuitUsecase,
        setError,
        router,
    });

    // Node Drag Sub-Controller
    const nodeDrag = useNodeDragSubController({
        getSvgCoords,
        circuit: circuitData.circuit,
        guiData,
        updateCircuitNode: circuitData.updateCircuitNode,
    });

    // Edge Drag Sub-Controller
    const edgeDrag = useEdgeDragSubController({
        getSvgCoords,
        circuit: circuitData.circuit,
        guiData,
        addCircuitEdge: circuitData.addCircuitEdge,
        updateCircuitEdge: circuitData.updateCircuitEdge,
        reattachFocusedElement: nodeDrag.reattachFocusedElement,
    });

    const updateCircuitGuiData = useCallback((): void => {
        if (!circuitData.circuit) {
            const err = new CircuitEditorPageControllerError("Unable to update gui data. Circuit is not defined.");
            console.error(err);

            setError("failedToParseCircuitDataError", true);
            return;
        }

        const circuitGuiData = circuitParserUsecase.parseToGuiData(circuitData.circuit.circuitData);
        if (!circuitGuiData.ok) {
            const err = new CircuitEditorPageControllerError(
                "Failed to update gui data. Failed to parse circuit data to gui data.",
                { cause: circuitGuiData.error },
            );
            console.error(err);

            setError("failedToParseCircuitDataError", true);
            return;
        }

        setGuiData(circuitGuiData.value);

        if (!isViewBoxInitialized || circuitGuiData.value) {
            initViewBox(circuitGuiData.value);
        }
    }, [circuitData.circuit, circuitParserUsecase, setError, isViewBoxInitialized, initViewBox]);

    const openUtilityMenu = useCallback(
        (kind: "node" | "edge") => (ev: React.MouseEvent) => {
            const svgCoordinate = getSvgCoords(ev);
            if (!svgCoordinate.ok) return;

            setUiState("diagramUtilityMenu", { open: kind, at: svgCoordinate.value });
        },
        [getSvgCoords, setUiState],
    );

    const closeUtilityMenu = useCallback(() => {
        setUiState("diagramUtilityMenu", { open: "none", at: null });
    }, [setUiState]);

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
        (kind: "infomation" | "circuitDiagram" | "rowCircuitData") => {
            setUiState("activityBarMenu", { open: kind });
        },
        [setUiState],
    );

    useEffect(() => {
        circuitData.fetch();
    }, [circuitData.fetch]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: With guiData, it causes infinite rendering. Without current activityBarMenu state, it cannot display circuit diagram when activityBarMenu is changed.
    useEffect(() => {
        if (!circuitData.circuit) return;

        updateCircuitGuiData();
    }, [circuitData.circuit, uiState.activityBarMenu.open]);

    return {
        error,
        circuit: circuitData.circuit,
        guiData,
        viewBox,
        panningRef,
        handleViewBoxMouseDown,
        handleViewBoxMouseMove,
        handleViewBoxMouseUp,
        handleViewBoxZoom,
        preventBrowserZoom,
        save: circuitData.save,
        deleteCircuit: circuitData.deleteCircuit,
        changeTitle: circuitData.changeTitle,
        changeDescription: circuitData.changeDescription,
        addCircuitNode: circuitData.addCircuitNode,
        deleteCircuitNode: circuitData.deleteCircuitNode,
        deleteCircuitEdge: circuitData.deleteCircuitEdge,
        circuitDiagramContainerRef,
        circuitDiagramSvgRef,
        focusedElement: nodeDrag.focusedElement,
        focusElement: nodeDrag.focusElement,
        draggingNode: nodeDrag.draggingNode,
        handleNodeMouseDown: nodeDrag.handleNodeMouseDown,
        handleNodeMouseMove: nodeDrag.handleNodeMouseMove,
        handleNodeMouseUp: nodeDrag.handleNodeMouseUp,
        draggingNodePin: edgeDrag.draggingNodePin,
        handleNodePinMouseDown: edgeDrag.handleNodePinMouseDown,
        handleNodePinMouseMove: edgeDrag.handleNodePinMouseMove,
        handleNodePinMouseUp: edgeDrag.handleNodePinMouseUp,
        tempEdge: edgeDrag.tempEdge,
        addEdgeWaypoint: circuitData.addEdgeWaypoint,
        deleteEdgeWaypoint: circuitData.deleteEdgeWaypoint,
        draggingWaypoint: edgeDrag.draggingWaypoint,
        handleWaypointMouseDown: edgeDrag.handleWaypointMouseDown,
        handleWaypointMouseMove: edgeDrag.handleWaypointMouseMove,
        handleWaypointMouseUp: edgeDrag.handleWaypointMouseUp,
        uiState,
        openUtilityMenu,
        closeUtilityMenu,
        openToolBarMenu,
        closeToolBarMenu,
        changeActivityBarMenu,
    };
};
