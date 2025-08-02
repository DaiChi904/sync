export namespace Attempt {
  export const proceed = <
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    S extends (...args: any) => any,
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    F extends (err: unknown) => any,
  >(
    successCallback: S,
    failureCallback: F,
  ): ReturnType<S> | ReturnType<F> => {
    if (isAsync(successCallback)) {
      console.error("SuccessCallback has to be syncrouns function. But received async function.");
    }
    if (isAsync(failureCallback)) {
      console.error("FailureCallback has to be syncrouns function. But received async function.");
    }

    try {
      return successCallback();
    } catch (err: unknown) {
      logger(err);
      return failureCallback(err);
    }
  };

  export const asyncProceed = async <
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    S extends (...args: any) => Promise<any>,
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    F extends (err: unknown) => any,
  >(
    successCallback: S,
    failureCallback: F,
  ): Promise<Awaited<ReturnType<S>> | ReturnType<F>> => {
    if (!isAsync(successCallback)) {
      console.error("SuccessCallback has to be async function. But received syncrouns function.");
    }
    if (isAsync(failureCallback)) {
      console.error("FailureCallback has to be syncrouns function. But received async function.");
    }

    try {
      return await successCallback();
    } catch (err: unknown) {
      logger(err);
      return failureCallback(err);
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
  const isAsync = (fn: (...args: any) => any) => fn.constructor === (async () => {}).constructor;

  const logger = (err: unknown) => {
    switch (true) {
      case err instanceof ModelValidationError:
      case err instanceof Abort: {
        console.error(err);
        break;
      }
      default: {
        console.error("Unhandled error:", err);
        break;
      }
    }
  };

  export class ModelValidationError extends Error {
    constructor(modelName: string, received: unknown) {
      super(`Invalid model: ${modelName}. Received: ${JSON.stringify(received)}`);
      this.name = "ModelValidationError";
    }
  }

  export class Abort extends Error {
    readonly tag: string | undefined;
    constructor(message: string, options?: { cause?: unknown; tag?: string }) {
      super(message, { cause: options?.cause ?? undefined });
      this.name = "Abort";
      this.tag = options?.tag ?? undefined;
    }
  }

  export const isAborted = (err: unknown): err is Abort => {
    return err instanceof Abort;
  };
}
