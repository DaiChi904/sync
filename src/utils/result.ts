import type { ModelValidationError } from "./attempt";

export type Result<T> = { ok: true; value: T } | { ok: false; error: ModelValidationError | unknown };
