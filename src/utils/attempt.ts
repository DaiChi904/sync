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
  export const proceed = async (
    successCallback: () => void | Promise<void>,
    failureCallback: () => void | Promise<void>,
  ): Promise<void> => {
    try {
      await Promise.resolve(successCallback());
    } catch (err: unknown) {
      switch (true) {
        case err instanceof ModelValidationError: {
          console.error(err);
          break;
        }
        case err instanceof Abort: {
          console.error(err);
          break;
        }
        default: {
          console.error("Unhandled error:", err);
          break;
        }
      }

      await Promise.resolve(failureCallback());
    }
  };

  export class Abort extends Error {
    constructor(message: string, cause?: unknown) {
      super(message, { cause });
      this.name = "Abort";
    }
  }
}
