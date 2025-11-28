export class SeedPageHandlerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "SeedPageHandlerError";
    this.cause = options?.cause;
  }
}

export type SeedPageStatus = "pending" | "seeding" | "done" | "error";

export interface ISeedPageHandler {
  status: SeedPageStatus;
  countDown: number;
  seed: () => void;
}
