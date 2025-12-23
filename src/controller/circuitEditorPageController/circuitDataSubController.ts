"use client";

import { useCallback, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitEditorPageControllerError } from "@/domain/model/controller/ICircuitEditorPageController";
import { CircuitEdge } from "@/domain/model/entity/circuitEdge";
import type { CircuitNode } from "@/domain/model/entity/circuitNode";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { IUpdateCircuitUsecase } from "@/domain/model/usecase/IUpdateCircuitUsecase";
import type { IDeleteCircuitUsecase } from "@/domain/model/usecase/IDeleteCircuitUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { Waypoint } from "@/domain/model/valueObject/waypoint";
import type { CircuitEditorPageErrorModel } from "@/domain/model/controller/ICircuitEditorPageController";

export interface CircuitDataSubControllerDeps {
    query: CircuitId;
    getCircuitDetailUsecase: IGetCircuitDetailUsecase;
    updateCircuitUsecase: IUpdateCircuitUsecase;
    deleteCircuitUsecase: IDeleteCircuitUsecase;
    setError: <K extends keyof CircuitEditorPageErrorModel>(key: K, value: CircuitEditorPageErrorModel[K]) => void;
    router: { push: (path: string) => void };
}

export const useCircuitDataSubController = ({
    query,
    getCircuitDetailUsecase,
    updateCircuitUsecase,
    deleteCircuitUsecase,
    setError,
    router,
}: CircuitDataSubControllerDeps) => {
    const [circuit, setCircuit] = useState<Circuit | undefined>(undefined);

    const fetch = useCallback(async (): Promise<void> => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
            const err = new CircuitEditorPageControllerError("Failed to get circuit detail.", {
                cause: circuitDetail.error,
            });
            console.error(err);

            setError("failedToGetCircuitDetailError", true);
            return;
        }

        setCircuit(circuitDetail.value);
    }, [query, getCircuitDetailUsecase, setError]);

    const save = useCallback(async (): Promise<void> => {
        if (!circuit) {
            const err = new CircuitEditorPageControllerError("Unable to save. Circuit is not defined.");
            console.error(err);

            setError("failedToSaveCircuitError", true);
            return;
        }

        const res = await updateCircuitUsecase.execute(circuit);
        if (!res.ok) {
            const err = new CircuitEditorPageControllerError("Failed to save circuit.", {
                cause: res.error,
            });
            console.error(err);

            setError("failedToSaveCircuitError", true);
            return;
        }

        setError("failedToSaveCircuitError", false);
    }, [circuit, updateCircuitUsecase, setError]);

    const deleteCircuit = useCallback(async () => {
        if (!circuit) {
            const err = new CircuitEditorPageControllerError("Unable to delete circuit. Circuit is not defined.");
            console.error(err);

            return;
        }

        const res = await deleteCircuitUsecase.execute(circuit.id);
        if (!res.ok) {
            const err = new CircuitEditorPageControllerError("Failed to delete circuit.", {
                cause: res.error,
            });
            console.error(err);

            return;
        }

        router.push("/");
    }, [circuit, deleteCircuitUsecase, router]);

    const changeTitle = useCallback((title: CircuitTitle): void => {
        try {
            setCircuit((prev) => {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to change title. Circuit is not defined.");
                }
                return Circuit.changeTitle(prev, title);
            });
        } catch (err: unknown) {
            console.error(err);
        }
    }, []);

    const changeDescription = useCallback((description: CircuitDescription): void => {
        try {
            setCircuit((prev) => {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to change description. Circuit is not defined.");
                }
                return Circuit.changeDescription(prev, description);
            });
        } catch (err: unknown) {
            console.error(err);
        }
    }, []);

    const addCircuitNode = useCallback(
        (newNode: CircuitNode): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to add circuit node. Circuit is not defined.");
                }

                const nodeAddResult = CircuitData.addNode(prev.circuitData, newNode);
                if (!nodeAddResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to add circuit node.", {
                        cause: nodeAddResult.error,
                    });
                }

                const next = Circuit.changeCircuitData(prev, nodeAddResult.value);

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const updateCircuitNode = useCallback(
        (newNode: CircuitNode): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to update circuit node. Circuit is not defined.");
                }

                const nodeUpdateResult = CircuitData.updateNode(prev.circuitData, newNode);
                if (!nodeUpdateResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to update circuit node.", {
                        cause: nodeUpdateResult.error,
                    });
                }

                const next = Circuit.from({
                    ...prev,
                    circuitData: nodeUpdateResult.value,
                });

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const deleteCircuitNode = useCallback(
        (nodeId: CircuitNodeId): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to delete circuit node. Circuit is not defined.");
                }

                const nodeDeleteResult = CircuitData.deleteNode(prev.circuitData, nodeId);
                if (!nodeDeleteResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to delete circuit node.", {
                        cause: nodeDeleteResult.error,
                    });
                }

                const next = Circuit.from({
                    ...prev,
                    circuitData: nodeDeleteResult.value,
                });

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const addCircuitEdge = useCallback(
        (newEdge: CircuitEdge): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to add circuit edge. Circuit is not defined.");
                }

                const edgeAddResult = CircuitData.addEdge(prev.circuitData, newEdge);
                if (!edgeAddResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to add circuit edge.", {
                        cause: edgeAddResult.error,
                    });
                }

                const next = Circuit.from({
                    ...prev,
                    circuitData: edgeAddResult.value,
                });

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const updateCircuitEdge = useCallback(
        (newEdge: CircuitEdge): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to update circuit edge. Circuit is not defined.");
                }

                const edgeUpdateResult = CircuitData.updateEdge(prev.circuitData, newEdge);
                if (!edgeUpdateResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to update circuit edge.", {
                        cause: edgeUpdateResult.error,
                    });
                }

                const next = Circuit.from({
                    ...prev,
                    circuitData: edgeUpdateResult.value,
                });

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const deleteCircuitEdge = useCallback(
        (edgeId: CircuitEdgeId): void => {
            const prev = circuit;
            try {
                if (!prev) {
                    throw new CircuitEditorPageControllerError("Unable to delete circuit edge. Circuit is not defined.");
                }

                const edgeDeleteResult = CircuitData.deleteEdge(prev.circuitData, edgeId);
                if (!edgeDeleteResult.ok) {
                    throw new CircuitEditorPageControllerError("Failed to delete circuit edge.", {
                        cause: edgeDeleteResult.error,
                    });
                }

                const next = Circuit.from({
                    ...prev,
                    circuitData: edgeDeleteResult.value,
                });

                setCircuit(next);
            } catch (err: unknown) {
                console.error(err);
            }
        },
        [circuit],
    );

    const addEdgeWaypoint = useCallback(
        (id: CircuitEdgeId) =>
            (at: Coordinate, index: number): void => {
                const prev = circuit?.circuitData?.edges.find((edge) => edge.id === id);
                if (!prev) return;
                const waypoints = prev.waypoints ? Waypoint.waypointsToCoordinateArray(prev.waypoints) : [];
                waypoints.splice(index, 0, at);

                updateCircuitEdge(
                    CircuitEdge.from({
                        id: prev.id,
                        from: prev.from,
                        to: prev.to,
                        waypoints: Waypoint.coordinatesToWaypoints(waypoints),
                    }),
                );
            },
        [circuit, updateCircuitEdge],
    );

    const deleteEdgeWaypoint = useCallback(
        (id: CircuitEdgeId) =>
            (index: number): void => {
                const prev = circuit?.circuitData?.edges.find((edge) => edge.id === id);
                if (!prev || !prev.waypoints) return;

                const waypoints = Waypoint.waypointsToCoordinateArray(prev.waypoints);
                if (index < 0 || index >= waypoints.length) return;

                waypoints.splice(index, 1);

                updateCircuitEdge(
                    CircuitEdge.from({
                        id: prev.id,
                        from: prev.from,
                        to: prev.to,
                        waypoints: Waypoint.coordinatesToWaypoints(waypoints),
                    }),
                );
            },
        [circuit, updateCircuitEdge],
    );

    return {
        circuit,
        fetch,
        save,
        deleteCircuit,
        changeTitle,
        changeDescription,
        addCircuitNode,
        updateCircuitNode,
        deleteCircuitNode,
        addCircuitEdge,
        updateCircuitEdge,
        deleteCircuitEdge,
        addEdgeWaypoint,
        deleteEdgeWaypoint,
    };
};
