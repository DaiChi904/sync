import type { Circuit } from "@/domain/model/aggregate/circuit.type";
import type { Result } from "@/utils/result";

type NameSpace = "circuit";

type NameSpaceValueMap = {
  circuit: Array<Circuit>;
};

export interface IStorage<T extends NameSpace> {
  save(value: NameSpaceValueMap[T]): Promise<Result<void>>;
  get(): Promise<Result<NameSpaceValueMap[T] | null>>;
  remove(): Promise<Result<void>>;
}

export class LocalStorageSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalStorageSaveError";
  }
}

export class LocalStorageGetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalStorageGetError";
  }
}

export class LocalStorageRemoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalStorageRemoveError";
  }
}

export class LocalStorage<T extends NameSpace> implements IStorage<T> {
  private readonly KEY: string;

  constructor(nameSpace: T) {
    this.KEY = `sync::${nameSpace}`;
  }

  async save(value: NameSpaceValueMap[T]): Promise<Result<void>> {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(value));
      return { ok: true, value: undefined };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new LocalStorageSaveError(
          `Failed to save to localStorage: ${err instanceof Error ? err.message : String(err)}`,
        ),
      };
    }
  }

  async get(): Promise<Result<NameSpaceValueMap[T] | null>> {
    try {
      const rawItem = localStorage.getItem(this.KEY);
      const item = rawItem !== null ? JSON.parse(rawItem) : null;
      return { ok: true, value: item as NameSpaceValueMap[T] | null };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new LocalStorageGetError(
          `Failed to get from localStorage: ${err instanceof Error ? err.message : String(err)}`,
        ),
      };
    }
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
        ),
      };
    }
  }
}
