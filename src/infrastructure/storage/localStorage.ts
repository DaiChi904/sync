import type { PrimitiveWaypoint } from "@/domain/model/valueObject/waypoint";
import { Attempt } from "@/utils/attempt";
import type { Result } from "@/utils/result";

type NameSpace = "circuit";

type NameSpaceValueMap = {
  circuit: Array<{
    id: string;
    title: string;
    description: string;
    circuitData: {
      nodes: Array<{
        id: string;
        type: string;
        inputs: Array<string>;
        outputs: Array<string>;
        coordinate: {
          x: number;
          y: number;
        };
        size: {
          x: number;
          y: number;
        };
      }>;
      edges: Array<{
        id: string;
        from: string;
        to: string;
        waypoints: PrimitiveWaypoint | null;
      }>;
    };
    createdAt: string;
    updatedAt: string;
  }>;
};

export interface ILocalStorage<T extends NameSpace> {
  save(value: NameSpaceValueMap[T]): Promise<Result<void>>;
  get(): Promise<Result<NameSpaceValueMap[T] | null>>;
  remove(): Promise<Result<void>>;
}

export class LocalStorageSaveError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, { cause: options?.cause ?? undefined });
    this.name = "LocalStorageSaveError";
  }
}

export class LocalStorageGetError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, { cause: options?.cause ?? undefined });
    this.name = "LocalStorageGetError";
  }
}

export class LocalStorageRemoveError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, { cause: options?.cause ?? undefined });
    this.name = "LocalStorageRemoveError";
  }
}

export class LocalStorage<T extends NameSpace> implements ILocalStorage<T> {
  private readonly KEY: string;

  constructor(nameSpace: T) {
    this.KEY = `sync::${nameSpace}`;
  }

  async save(value: NameSpaceValueMap[T]): Promise<Result<void>> {
    return Attempt.proceed(
      () => {
        localStorage.setItem(this.KEY, JSON.stringify(value));
        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: new LocalStorageSaveError(
            `Failed to save to localStorage: ${err instanceof Error ? err.message : String(err)}`,
            { cause: err },
          ),
        } as const;
      },
    );
  }

  async get(): Promise<Result<NameSpaceValueMap[T] | null>> {
    return Attempt.proceed(
      () => {
        const rawItem = localStorage.getItem(this.KEY);
        const item = rawItem !== null ? JSON.parse(rawItem) : null;
        return { ok: true, value: item as NameSpaceValueMap[T] | null } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: new LocalStorageGetError(
            `Failed to get from localStorage: ${err instanceof Error ? err.message : String(err)}`,
            { cause: err },
          ),
        } as const;
      },
    );
  }

  async remove(): Promise<Result<void>> {
    try {
      localStorage.removeItem(this.KEY);
      return { ok: true, value: undefined };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new LocalStorageRemoveError(
          `Failed to remove from localStorage: ${err instanceof Error ? err.message : String(err)}`,
          { cause: err },
        ),
      };
    }
  }
}
