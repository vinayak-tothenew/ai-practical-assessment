import type { NextFunction, Request, Response } from "express";

import * as ticketService from "../services/ticketService.js";
import { parseIdParam } from "../utils/params.js";

export function listTickets(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = ticketService.listTickets({
      search: req.query.search,
      status: req.query.status,
    });
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export function getTicket(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = ticketService.getTicket(parseIdParam(req.params.id));
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export function createTicket(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = ticketService.createTicket(req.body ?? {});
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = ticketService.updateTicket(
      parseIdParam(req.params.id),
      req.body ?? {},
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export function changeTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const data = ticketService.changeTicketStatus(
      parseIdParam(req.params.id),
      req.body ?? {},
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
