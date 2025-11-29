export class SeedPageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "SeedPageControllerError";
    this.cause = options?.cause;
  }
}

export type SeedPageStatus = "pending" | "seeding" | "done" | "error";

export interface ISeedPageController {
  status: SeedPageStatus;
  countDown: number;
  seed: () => void;
}
