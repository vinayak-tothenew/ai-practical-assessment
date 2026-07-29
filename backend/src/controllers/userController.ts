import type { NextFunction, Request, Response } from "express";

import * as userService from "../services/userService.js";

export function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    res.json({ data: userService.listUsers() });
  } catch (error) {
    next(error);
  }
}
