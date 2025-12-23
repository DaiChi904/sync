export class ModelValidationError extends Error {
  constructor(modelName: string, received: unknown, contextMessage: string = "") {
    const context = contextMessage ? `\n${contextMessage}` : "";
    super(`Invalid model: ${modelName}.\nReceived: ${JSON.stringify(received)}${context}`);
    this.name = "ModelValidationError";
  }
}
