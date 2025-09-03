export class ModelValidationError extends Error {
  constructor(modelName: string, received: unknown) {
    super(`Invalid model: ${modelName}. Received: ${JSON.stringify(received)}`);
    this.name = "ModelValidationError";
  }
}
