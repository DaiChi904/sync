"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { mockCircuitData } from "@/constants/mockCircuitData";
import {
  type ISeedPageHandler,
  SeedPageHandlerError,
  type SeedPageStatus,
} from "@/domain/model/handler/ISeedPageHandler";
import type { IAddCircuitUsecase } from "@/domain/model/usecase/IAddCircuitUsecase";
import type { IDeleteCircuitUsecase } from "@/domain/model/usecase/IDeleteCircuitUsecase";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";

interface SeedPageHandlerDependencies {
  getCircuitOverviewsUsecase: IGetCircuitOverviewsUsecase;
  addCircuitUsecase: IAddCircuitUsecase;
  deleteCircuitUsecase: IDeleteCircuitUsecase;
}

export const useSeedPageHandler = ({
  getCircuitOverviewsUsecase,
  addCircuitUsecase,
  deleteCircuitUsecase,
}: SeedPageHandlerDependencies): ISeedPageHandler => {
  const params = useSearchParams();
  const router = useRouter();

  const seedImmed = params.get("opt") === "immed";

  const [status, setStatus] = useState<SeedPageStatus>("pending");
  const [countDown, setCountDown] = useState<number>(Number.NaN);

  const seed = useCallback(async () => {
    try {
      setStatus("seeding");
      const getCircuitOverviewsResult = await getCircuitOverviewsUsecase.getOverviews();
      if (!getCircuitOverviewsResult.ok) {
        throw new SeedPageHandlerError("Couldn't get circuits infomation.", {
          cause: getCircuitOverviewsResult.error,
        });
      }

      const storedCircuitIds = getCircuitOverviewsResult.value.map((c) => c.id);
      for (const id of storedCircuitIds) {
        const res = await deleteCircuitUsecase.execute(id);
        if (!res.ok) throw new SeedPageHandlerError("Failed to delete circuit.", { cause: res.error });
      }
      for (const mcd of mockCircuitData) {
        const res = await addCircuitUsecase.execute(mcd);
        if (!res.ok) throw new SeedPageHandlerError("Failed to save circuit.", { cause: res.error });
      }
      setStatus("done");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
    }
  }, [getCircuitOverviewsUsecase, deleteCircuitUsecase, addCircuitUsecase]);

  const pushToHomeInFiveSec = useCallback(async () => {
    for (let i = 5; 0 < i; i--) {
      setCountDown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    router.push("/");
  }, [router]);

  useEffect(() => {
    seedImmed ? seed() : alert("Caution: Your data will lose if you execute seed.");
  }, [seedImmed, seed]);

  useEffect(() => {
    if (status !== "done") return;
    pushToHomeInFiveSec();
  }, [status, pushToHomeInFiveSec]);

  return {
    status: status,
    countDown: countDown,
    seed: seed,
  };
};
