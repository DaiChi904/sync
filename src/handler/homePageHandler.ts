"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Circuit } from "@/domain/model/aggregate/circuit";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { type HomePageError, homePageError, type IHomePageHandler } from "@/domain/model/handler/IHomePageHandler";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import { usePartialState } from "@/hooks/partialState";
import { Attempt } from "@/utils/attempt";
import { CreatedDateTime } from "./../domain/model/valueObject/createdDateTime";

interface HomePageHandlerDependencies {
  getCircuitOverviewsUsecase: IGetCircuitOverviewsUsecase;
  circuitEditorUsecase: ICircuitEditorUsecase;
}

export const useHomePageHandler = ({
  getCircuitOverviewsUsecase,
  circuitEditorUsecase,
}: HomePageHandlerDependencies): IHomePageHandler => {
  const router = useRouter();

  const [error, setError] = usePartialState<HomePageError>(homePageError);
  const [uiState, setUiState] = usePartialState<IHomePageHandler["uiState"]>({
    tab: { open: "home" },
  });

  const [circuitOverviews, setCircuitOverviews] = useState<Array<CircuitOverview> | undefined>(undefined);

  const fetch = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        const circuitOverviews = await getCircuitOverviewsUsecase.getOverviews();
        if (!circuitOverviews.ok) {
          throw new Attempt.Abort("homePageHandler.fetch", "Failed to get circuit overviews.", {
            cause: circuitOverviews.error,
          });
        }

        setCircuitOverviews(circuitOverviews.value);
      },
      () => {
        setError("failedToGetCircuitOverviewsError", true);
      },
    );
  }, [getCircuitOverviewsUsecase, setError]);

  const addNewCircuit = useCallback(
    (kind: "empty") => {
      Attempt.asyncProceed(
        async () => {
          switch (kind) {
            case "empty": {
              const newCircuitId = CircuitId.generate();
              const res = await circuitEditorUsecase.add(
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
                throw new Attempt.Abort("homePageHandler.addNewCircuit", "Failed to add new circuit.", {
                  cause: res.error,
                });
              }

              router.push(`/circuit/${newCircuitId}`);
              break;
            }
          }
        },
        () => {},
      );
    },
    [circuitEditorUsecase, router],
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
