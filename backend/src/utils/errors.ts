export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  public constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  public constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  public constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class InvalidTransitionError extends AppError {
  public readonly from: string;
  public readonly to: string;
  public readonly allowed: string[];

  public constructor(from: string, to: string, allowed: string[]) {
    super("Invalid status transition", 422, { from, to, allowed });
    this.name = "InvalidTransitionError";
    this.from = from;
    this.to = to;
    this.allowed = allowed;
  }
}
