export class ModelValidationError extends Error {
  constructor(modelName: string, received: unknown) {
    super(`Invalid model: ${modelName}. Received: ${JSON.stringify(received)}`);
    this.name = "ModelValidationError";
  }
}

/**
 * In this project, the principle is to handle errors with Result-typed value and throwing error is not allowed.
 * But for ease of use, ModelValidationError might be thrown in the initialization of the model.
 * In addition, throwing error is can be a best choice.
 *
 * Therefore, it is allowed to thorow class of Abort only inside of Attempt.proceed if it is necessary.
 */
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

    if (successCallback.constructor.name === "AsyncFunction") {
      console.error("SuccessCallback has to be syncrouns function. But received async function.");
    }
    if (failureCallback.constructor.name === "AsyncFunction") {
      console.error("FailureCallback has to be syncrouns function. But received async function.");
    }

    // If successCallback is an async function, try-catch cannot directly catch asynchronous errors (only synchronous throws are caught).
    // Therefore, catch errors and handle them by returning failureCallback in catch of successCallback.
    // if successCallback is a synchronous function, use try-catch as usual.
    try {
      return successCallback();
    } catch (err: unknown) {
      logger(err);
      return failureCallback(err);
    }
  };

  export const asyncProceed = <
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    S extends (...args: any) => Promise<any>,
    // biome-ignore lint/suspicious/noExplicitAny: This is appropriate implementation
    F extends (err: unknown) => any,
  >(
    successCallback: S,
    failureCallback: F,
  ): Promise<ReturnType<S>> | ReturnType<F> => {
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

    if (successCallback.constructor.name !== "AsyncFunction") {
      console.error("SuccessCallback has to be async function. But received syncrouns function.");
    }
    if (failureCallback.constructor.name === "AsyncFunction") {
      console.error("FailureCallback has to be syncrouns function. But received async function.");
    }

    // If successCallback is an async function, try-catch cannot directly catch asynchronous errors (only synchronous throws are caught).
    // Therefore, catch errors and handle them by returning failureCallback in catch of successCallback.
    // if successCallback is a synchronous function, use try-catch as usual.
    try {
      return Promise.resolve(successCallback()).catch((err) => {
        logger(err);
        return failureCallback(err);
      });
    } catch (err: unknown) {
      logger(err);
      return failureCallback(err);
    }
  };

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
