"use client";

import { useCallback, useState } from "react";
import { LEFT_CLICK } from "@/constants/mouseEvent";
import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNode } from "@/domain/model/entity/circuitNode";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { Result } from "@/utils/result";

export interface NodeDragSubControllerDeps {
    getSvgCoords: (ev: React.MouseEvent) => Result<Coordinate, unknown>;
    circuit: Circuit | undefined;
    guiData: CircuitGuiData | undefined;
    updateCircuitNode: (node: CircuitNode) => void;
}

export const useNodeDragSubController = ({
    getSvgCoords,
    circuit,
    guiData,
    updateCircuitNode,
}: NodeDragSubControllerDeps) => {
    const [focusedElement, setFocusedElement] = useState<
        { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } } | null
    >(null);
    const [draggingNode, setDraggingNode] = useState<CircuitGuiNode | null>(null);

    const focusElement: {
        (kind: "node"): (value: CircuitGuiNode) => void;
        (kind: "edge"): (value: CircuitGuiEdge) => void;
    } = useCallback((kind: "node" | "edge") => {
        // biome-ignore lint/suspicious/noExplicitAny: Type safety is preserved.
        return (value: any) => {
            setFocusedElement({ kind, value });
        };
    }, []);

    const reattachFocusedElement = useCallback(() => {
        if (!focusedElement) return;

        switch (focusedElement.kind) {
            case "node": {
                const node = guiData?.nodes.find((n) => n.id === focusedElement.value.id);
                if (!node) {
                    setFocusedElement(null);
                    return;
                }
                setFocusedElement({ kind: "node", value: node });
                break;
            }
            case "edge": {
                const edge = guiData?.edges.find((e) => e.id === focusedElement.value.id);
                if (!edge) {
                    setFocusedElement(null);
                    return;
                }
                setFocusedElement({ kind: "edge", value: { ...edge, waypointIdx: focusedElement.value.waypointIdx } });
                break;
            }
        }
    }, [focusedElement, guiData]);

    const handleNodeMouseDown = useCallback(
        (ev: React.MouseEvent, node: CircuitGuiNode) => {
            if (ev.button !== LEFT_CLICK) return;

            const svgCoordinate = getSvgCoords(ev);
            if (!svgCoordinate.ok) return;

            const { x: initialMouseX, y: initialMouseY } = svgCoordinate.value;

            setDraggingNode({
                ...node,
                coordinate: Coordinate.from({ x: initialMouseX - node.coordinate.x, y: initialMouseY - node.coordinate.y }),
            });
        },
        [getSvgCoords],
    );

    const handleNodeMouseMove = useCallback(
        (ev: React.MouseEvent) => {
            if (!draggingNode) return;

            const svgCoordinate = getSvgCoords(ev);
            if (!svgCoordinate.ok) return;

            const { x, y } = svgCoordinate.value;
            const newX = x - draggingNode.coordinate.x;
            const newY = y - draggingNode.coordinate.y;

            const node = circuit?.circuitData.nodes.find((n) => n.id === draggingNode.id);
            if (node) {
                updateCircuitNode({
                    ...node,
                    coordinate: Coordinate.from({ x: newX, y: newY }),
                });
            }
        },
        [draggingNode, getSvgCoords, circuit, updateCircuitNode],
    );

    const handleNodeMouseUp = useCallback(() => {
        setDraggingNode(null);
        reattachFocusedElement();
    }, [reattachFocusedElement]);

    return {
        focusedElement,
        focusElement,
        reattachFocusedElement,
        draggingNode,
        handleNodeMouseDown,
        handleNodeMouseMove,
        handleNodeMouseUp,
    };
};
