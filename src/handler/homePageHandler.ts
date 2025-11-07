"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type HomePageErrorModel,
  HomePageHandlerError,
  type HomePageUiStateModel,
  type IHomePageHandler,
  initialHomePageError,
} from "@/domain/model/handler/IHomePageHandler";
import type { IAddCircuitUsecase } from "@/domain/model/usecase/IAddCircuitUsecase";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import { usePartialState } from "@/hooks/partialState";
import { CreatedDateTime } from "./../domain/model/valueObject/createdDateTime";

interface HomePageHandlerDependencies {
  getCircuitOverviewsUsecase: IGetCircuitOverviewsUsecase;
  addCircuitUsecase: IAddCircuitUsecase;
}

export const useHomePageHandler = ({
  getCircuitOverviewsUsecase,
  addCircuitUsecase,
}: HomePageHandlerDependencies): IHomePageHandler => {
  const router = useRouter();

  const [error, setError] = usePartialState<HomePageErrorModel>(initialHomePageError);
  const [uiState, setUiState] = usePartialState<HomePageUiStateModel>({
    tab: { open: "home" },
  });

  const [circuitOverviews, setCircuitOverviews] = useState<Array<CircuitOverview> | undefined>(undefined);

  const fetch = useCallback(async (): Promise<void> => {
    try {
      const circuitOverviews = await getCircuitOverviewsUsecase.getOverviews();
      if (!circuitOverviews.ok) {
        throw new HomePageHandlerError("Failed to get circuit overviews.", {
          cause: circuitOverviews.error,
        });
      }

      setCircuitOverviews(circuitOverviews.value);
    } catch (err: unknown) {
      console.error(err);
      setError("failedToGetCircuitOverviewsError", true);
    }
  }, [getCircuitOverviewsUsecase, setError]);

  const addNewCircuit = useCallback(
    async (kind: "empty") => {
      try {
        switch (kind) {
          case "empty": {
            const newCircuitId = CircuitId.generate();
            const res = await addCircuitUsecase.execute(
              Circuit.from({
                id: newCircuitId,
                title: CircuitTitle.from(""),
                description: CircuitDescription.from(""),
                circuitData: CircuitData.from({ nodes: [], edges: [] }),
                createdAt: CreatedDateTime.fromDate(new Date()),
                updatedAt: UpdatedDateTime.fromDate(new Date()),
              }),
            );
            if (!res.ok) {
              throw new HomePageHandlerError("Failed to add new circuit.", {
                cause: res.error,
              });
            }

            router.push(`/circuit/${newCircuitId}`);
            break;
          }
        }
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [addCircuitUsecase, router],
  );

  const changeActivityBarMenu = useCallback(
    (kind: "home" | "new") => {
      setUiState("tab", { open: kind });
    },
    [setUiState],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    error,
    uiState,
    circuitOverviews,
    changeActivityBarMenu,
    addNewCircuit,
  };
};
