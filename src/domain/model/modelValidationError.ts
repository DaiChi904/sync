export class ModelValidationError extends Error {
  constructor(modelName: string, received: unknown, contextMessage: string) {
    super(`Invalid model: ${modelName}.\nReceived: ${JSON.stringify(received)}\n${contextMessage}`);
    this.name = "ModelValidationError";
  }
}
