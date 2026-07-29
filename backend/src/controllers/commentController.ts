import type { NextFunction, Request, Response } from "express";

import * as commentService from "../services/commentService.js";
import { parseIdParam } from "../utils/params.js";

export function listComments(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = commentService.listComments(parseIdParam(req.params.id));
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export function addComment(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = commentService.addComment(
      parseIdParam(req.params.id),
      req.body ?? {},
    );
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}
