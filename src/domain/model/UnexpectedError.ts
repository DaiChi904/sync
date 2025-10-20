export class UnexpectedError extends Error {
  constructor(
    options: { cause: unknown }, 
    contextMessage?: string
  ) {
    const baseMessage = "An unexpected error occurred.";
    const message = contextMessage 
      ? `${baseMessage}\n[Context: ${contextMessage}]` 
      : baseMessage;

    super(message, options); 
    this.name = "UnexpectedError";
  }
}
