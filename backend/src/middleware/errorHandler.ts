import type { NextFunction, Request, Response } from "express";

import { AppError, InvalidTransitionError } from "../utils/errors.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof InvalidTransitionError) {
    res.status(error.statusCode).json({
      error: error.message,
      from: error.from,
      to: error.to,
      allowed: error.allowed,
    });
    return;
  }

  if (error instanceof AppError) {
    const body: { error: string; details?: unknown } = {
      error: error.message,
    };

    if (error.details !== undefined) {
      body.details = error.details;
    }

    res.status(error.statusCode).json(body);
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}
