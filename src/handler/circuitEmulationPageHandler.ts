import { useCallback, useEffect, useState } from "react";
import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import {
  type CircuitEmulationPageErrorModel,
  type ICircuitEmulationPageHandler,
  initialCircuitEmulationPageError,
} from "@/domain/model/handler/ICircuitEmulationPageHandler";
import type {
  ICreateEmulationSessionUsecase,
  IEmulationSession,
} from "@/domain/model/usecase/ICreateEmulationSessionUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import { EvalDuration } from "@/domain/model/valueObject/evalDuration";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { OutputRecord } from "@/domain/model/valueObject/outputRecord";
import { Tick } from "@/domain/model/valueObject/tick";
import type { CircuitParserService } from "@/domain/service/circuitParserService";
import { usePartialState } from "@/hooks/partialState";

interface CircuitEmulationPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  createEmulationSessionUsecase: ICreateEmulationSessionUsecase;
  circuitParserUsecase: CircuitParserService;
}

export const useCircuitEmulationPageHandler = ({
  query,
  getCircuitDetailUsecase,
  createEmulationSessionUsecase,
  circuitParserUsecase,
}: CircuitEmulationPageHandlerDependencies): ICircuitEmulationPageHandler => {
  const [error, setError] = usePartialState<CircuitEmulationPageErrorModel>(initialCircuitEmulationPageError);
  const [uiState, setUiState] = usePartialState<ICircuitEmulationPageHandler["uiState"]>({
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "evalMenu" },
  });

  const [circuit, setCircuit] = useState<Circuit | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);
  const [session, setSession] = useState<IEmulationSession | undefined>(undefined);

  const [currentTick, setCurrentTick] = useState<Tick>(Tick.from(0));
  const [evalDuration, setEvalDuration] = useState<EvalDuration>(EvalDuration.from(10));
  const [entryInputs, setEntryInputs] = useState<InputRecord>(InputRecord.from({}));
  const [outputs, setOutputs] = useState<OutputRecord>(OutputRecord.from({}));

  const fetch = useCallback(async (): Promise<void> => {
    const res = await getCircuitDetailUsecase.getById(query);
    if (!res.ok) {
      console.error(res.error);
      setError("emulationEnvironmentCreationError", true);
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
      setError("emulationEnvironmentCreationError", true);
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
        setError("emulationEnvironmentCreationError", true);
        return;
      }

      const session = createEmulationSessionUsecase.createSession(graph.value, config);
      if (!session.ok) {
        console.error(session.error);
        setError("emulationEnvironmentCreationError", true);
        return;
      }

      setSession(session.value);
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
      setError("failedToEvalCircuitError", true);
      return;
    }

    setOutputs(res.value.output);
    setCurrentTick(res.value.tick.to);
  }, [entryInputs, evalDuration, session, setError]);

  const changeEvalDuration = useCallback((duration: EvalDuration): void => {
    setEvalDuration(duration);
  }, []);

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

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (circuit) {
      createGuiData();
      createNewSession({ evalDelay: EvalDelay.from(10) });
    }
  }, [circuit, createGuiData, createNewSession]);

  useEffect(() => {
    if (session) {
      session.init();
      registInputNodes();
      initOutputs();
    }
  }, [session, registInputNodes, initOutputs]);

  return {
    error,
    uiState,
    circuit,
    guiData,
    currentTick,
    evalDuration,
    entryInputs,
    outputs,
    updateEntryInputs,
    evalCircuit,
    changeEvalDuration,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  };
};
