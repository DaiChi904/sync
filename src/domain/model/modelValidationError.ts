export class ModelValidationError extends Error {
  constructor(modelName: string, received: unknown) {
    super(`Invalid model: ${modelName}. Received: ${JSON.stringify(received)}`);
    this.name = "ModelValidationError";
  }
}

/**
 * In this project, the principle is to handle errors with Result-typed value.
 * But for ease of use, ModelValidationError might be thrown in the initialization of the model.
 *
 * To catch and handle this error, use this wrapper inside of handler layer.
 * This method is not allowed to use outside of handler layer.
 */
export const handleValidationError = async (
  successCallback: () => void | Promise<void>,
  failureCallback: () => void | Promise<void>,
): Promise<void> => {
  try {
    await Promise.resolve(successCallback());
  } catch (err: unknown) {
    if (err instanceof ModelValidationError) {
      console.error(`Invalid value has been provided to the model. Detail: ${err.message}`);
    } else {
      console.error("Unknown error occurred:", err);
    }
    await Promise.resolve(failureCallback());
  }
};
