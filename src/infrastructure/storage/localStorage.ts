import { UnexpectedError } from "@/domain/model/unexpectedError";
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

export class QuotaExceededError extends Error {
  constructor(readonly key: string) {
    super("Quota exceeded.");
    this.name = "QuotaExceededError";
    this.key = key;
  }
}

export class SecurityError extends Error {
  constructor(readonly key: string) {
    super("Security error.");
    this.name = "SecurityError";
    this.key = key;
  }
}

export class DataCorruptedError extends Error {
  constructor(
    readonly key: string,
    options?: { cause?: unknown },
  ) {
    super("Failed to parse data. It may be corrupted.");
    this.name = "DataCorruptedError";
    this.key = key;
    this.cause = options?.cause;
  }
}

export interface ILocalStorage<T extends NameSpace> {
  save(value: NameSpaceValueMap[T]): Promise<Result<void, QuotaExceededError | UnexpectedError>>;
  get(): Promise<Result<NameSpaceValueMap[T] | null, SecurityError | DataCorruptedError | UnexpectedError>>;
  remove(): Promise<Result<void, UnexpectedError>>;
}

export class LocalStorage<T extends NameSpace> implements ILocalStorage<T> {
  private readonly KEY: string;

  constructor(nameSpace: T) {
    this.KEY = `sync::${nameSpace}`;
  }

  async save(value: NameSpaceValueMap[T]): Promise<Result<void, QuotaExceededError | UnexpectedError>> {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(value));
      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.log(err);
      switch (true) {
        case err instanceof DOMException && err.name === "QuotaExceededError": {
          const quotaExceededError = new QuotaExceededError(this.KEY);
          return { ok: false, error: quotaExceededError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  async get(): Promise<Result<NameSpaceValueMap[T] | null, SecurityError | SyntaxError | UnexpectedError>> {
    try {
      const rawItem = localStorage.getItem(this.KEY);
      const item = rawItem !== null ? JSON.parse(rawItem) : null;
      return { ok: true, value: item as NameSpaceValueMap[T] | null };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof DOMException && err.name === "SecurityError": {
          const securityError = new SecurityError(this.KEY);
          return { ok: false, error: securityError };
        }
        case err instanceof SyntaxError: {
          const dataCorruptedError = new DataCorruptedError(this.KEY, { cause: err });
          return { ok: false, error: dataCorruptedError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  async remove(): Promise<Result<void, UnexpectedError>> {
    try {
      localStorage.removeItem(this.KEY);
      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      return {
        ok: false,
        error: new UnexpectedError({ cause: err }),
      };
    }
  }
}
