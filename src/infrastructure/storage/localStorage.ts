import type { PrimitiveWaypoint } from "@/domain/model/valueObject/waypoint";
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

export class LocalStorageError extends Error {
  readonly key: string;

  constructor(message: string, key: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "LocalStorageError";
    this.key = key;
    this.cause = options?.cause;
  }
}

export interface ILocalStorage<T extends NameSpace> {
  save(value: NameSpaceValueMap[T]): Promise<Result<void, LocalStorageError>>;
  get(): Promise<Result<NameSpaceValueMap[T] | null, LocalStorageError>>;
  remove(): Promise<Result<void, LocalStorageError>>;
}

export class LocalStorage<T extends NameSpace> implements ILocalStorage<T> {
  private readonly KEY: string;

  constructor(nameSpace: T) {
    this.KEY = `sync::${nameSpace}`;
  }

  async save(value: NameSpaceValueMap[T]): Promise<Result<void, LocalStorageError>> {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(value));
      return { ok: true, value: undefined } as const;
    } catch (err: unknown) {
      console.error(err);
      return {
        ok: false,
        error: new LocalStorageError(`Failed to save to localStorage.`, this.KEY, { cause: err }),
      };
    }
  }

  async get(): Promise<Result<NameSpaceValueMap[T] | null, LocalStorageError>> {
    try {
      const rawItem = localStorage.getItem(this.KEY);
      const item = rawItem !== null ? JSON.parse(rawItem) : null;
      return { ok: true, value: item as NameSpaceValueMap[T] | null } as const;
    } catch (err: unknown) {
      console.error(err);
      return {
        ok: false,
        error: new LocalStorageError(`Failed to get from localStorage.`, this.KEY, { cause: err }),
      };
    }
  }

  async remove(): Promise<Result<void, LocalStorageError>> {
    try {
      localStorage.removeItem(this.KEY);
      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      return {
        ok: false,
        error: new LocalStorageError(`Failed to remove from localStorage.`, this.KEY, { cause: err }),
      };
    }
  }
}
