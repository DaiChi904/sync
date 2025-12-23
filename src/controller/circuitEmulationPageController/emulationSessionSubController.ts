"use client";

import { useCallback, useState } from "react";
import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitEmulationErrorKind } from "@/domain/model/controller/ICircuitEmulationPageController";
import type {
    ICreateEmulationSessionUsecase,
    IEmulationSession,
} from "@/domain/model/usecase/ICreateEmulationSessionUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import { EvalDuration } from "@/domain/model/valueObject/evalDuration";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { OutputRecord } from "@/domain/model/valueObject/outputRecord";
import { Tick } from "@/domain/model/valueObject/tick";
import type { CircuitParserService } from "@/domain/service/circuitParserService";

export interface EmulationSessionSubControllerDeps {
    query: CircuitId;
    getCircuitDetailUsecase: IGetCircuitDetailUsecase;
    createEmulationSessionUsecase: ICreateEmulationSessionUsecase;
    circuitParserUsecase: CircuitParserService;
    setError: (kind: CircuitEmulationErrorKind, message?: string) => void;
}

export const useEmulationSessionSubController = ({
    query,
    getCircuitDetailUsecase,
    createEmulationSessionUsecase,
    circuitParserUsecase,
    setError,
}: EmulationSessionSubControllerDeps) => {
    const [circuit, setCircuit] = useState<Circuit>();
    const [guiData, setGuiData] = useState<CircuitGuiData>();
    const [session, setSession] = useState<IEmulationSession>();

    const [currentTick, setCurrentTick] = useState<Tick>(Tick.from(0));
    const [evalDuration, setEvalDuration] = useState<EvalDuration>(EvalDuration.from(10));
    const [entryInputs, setEntryInputs] = useState<InputRecord>(InputRecord.from({}));
    const [outputs, setOutputs] = useState<OutputRecord>(OutputRecord.from({}));

    const fetch = useCallback(async (): Promise<void> => {
        const res = await getCircuitDetailUsecase.getById(query);
        if (!res.ok) {
            console.error(res.error);
            setError("emulationEnvironmentCreationError");
            return;
        }

        setCircuit(res.value);
    }, [query, getCircuitDetailUsecase, setError]);

    const createGuiData = useCallback((): void => {
        if (!circuit) {
            console.error("No circuit found.");
            return;
        }

        const gui = circuitParserUsecase.parseToGuiData(circuit.circuitData);
        if (!gui.ok) {
            console.error(gui.error);
            setError("guiRenderError");
            return;
        }

        setGuiData(gui.value);
    }, [circuit, circuitParserUsecase, setError]);

    const createNewSession = useCallback(
        (config: { evalDelay: EvalDelay }) => {
            if (!circuit) {
                console.error("No circuit found.");
                return;
            }

            const graph = circuitParserUsecase.parseToGraphData(circuit.circuitData);
            if (!graph.ok) {
                console.error(graph.error);
                setError("emulationEnvironmentCreationError");
                return;
            }

            const sessionResult = createEmulationSessionUsecase.createSession(graph.value, config);
            if (!sessionResult.ok) {
                console.error(sessionResult.error);
                setError("emulationEnvironmentCreationError");
                return;
            }

            setSession(sessionResult.value);
        },
        [circuit, createEmulationSessionUsecase, circuitParserUsecase, setError],
    );

    const registInputNodes = useCallback((): void => {
        if (!session) {
            console.error("No session found.");
            return;
        }

        const entryNodes = session.getEntryInputs();
        const inputRecord = InputRecord.from({});
        entryNodes.forEach((node) => {
            inputRecord[node] = EvalResult.from(false);
        });

        setEntryInputs(inputRecord);
    }, [session]);

    const updateEntryInputs = useCallback((nodeId: CircuitNodeId, value: EvalResult): void => {
        setEntryInputs((prev) => ({
            ...prev,
            [nodeId]: value,
        }));
    }, []);

    const initOutputs = useCallback((): void => {
        if (!session) {
            console.error("No session found.");
            return;
        }

        const initialOutputs = session.getOutputsByTick(Tick.from(0));
        if (!initialOutputs) {
            console.error("No initial outputs found.");
            return;
        }

        setOutputs(initialOutputs);
    }, [session]);

    const evalCircuit = useCallback((): void => {
        if (!session) {
            console.error("No session found.");
            return;
        }

        const res = session.eval(entryInputs, evalDuration);
        if (!res.ok) {
            console.log(res.error);
            setError("failedToEvalCircuitError");
            return;
        }

        setOutputs(res.value.output);
        setCurrentTick(res.value.tick.to);
    }, [entryInputs, evalDuration, session, setError]);

    const changeEvalDuration = useCallback((duration: EvalDuration): void => {
        setEvalDuration(duration);
    }, []);

    const initializeSession = useCallback(() => {
        if (session) {
            session.init();
            registInputNodes();
            initOutputs();
        }
    }, [session, registInputNodes, initOutputs]);

    const initializeCircuit = useCallback(() => {
        if (circuit) {
            createGuiData();
            createNewSession({ evalDelay: EvalDelay.from(1) });
        }
    }, [circuit, createGuiData, createNewSession]);

    return {
        circuit,
        guiData,
        session,
        currentTick,
        evalDuration,
        entryInputs,
        outputs,
        fetch,
        initializeCircuit,
        initializeSession,
        updateEntryInputs,
        evalCircuit,
        changeEvalDuration,
    };
};
