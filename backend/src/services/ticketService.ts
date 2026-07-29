import * as ticketRepository from "../repositories/ticketRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import type {
  CreateTicketInput,
  Ticket,
  TicketDetail,
  TicketListQuery,
  TicketPriority,
  UpdateTicketInput,
  UserSummary,
} from "../types/index.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import {
  assertValidTransition,
  isTicketStatus,
  parseStatus,
} from "./ticketStatusService.js";

const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];

function isPriority(value: unknown): value is TicketPriority {
  return typeof value === "string" && PRIORITIES.includes(value as TicketPriority);
}

function requireExistingUser(id: number, field: string): void {
  if (!userRepository.findUserById(id)) {
    throw new NotFoundError(`${field} user not found`);
  }
}

function toUserSummary(id: number | null): UserSummary | null {
  if (id === null) {
    return null;
  }

  const user = userRepository.findUserById(id);
  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name };
}

function toTicketDetail(ticket: Ticket): TicketDetail {
  const createdBy = toUserSummary(ticket.createdBy);

  if (!createdBy) {
    throw new NotFoundError("createdBy user not found");
  }

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignedTo: toUserSummary(ticket.assignedTo),
    createdBy,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

function parseOptionalId(value: unknown, field: string): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`${field} must be a positive integer or null`);
  }

  return id;
}

function parseRequiredId(value: unknown, field: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`${field} is required and must be a positive integer`);
  }

  return id;
}

function parseRequiredString(
  value: unknown,
  field: string,
  min: number,
  max: number,
): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} is required`);
  }

  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new ValidationError(
      `${field} must be between ${min} and ${max} characters`,
    );
  }

  return trimmed;
}

export function listTickets(query: {
  search?: unknown;
  status?: unknown;
}): Ticket[] {
  const filters: TicketListQuery = {};

  if (typeof query.search === "string" && query.search.trim()) {
    filters.search = query.search.trim();
  }

  if (query.status !== undefined && query.status !== "") {
    if (!isTicketStatus(query.status)) {
      throw new ValidationError("status filter must be a valid ticket status");
    }
    filters.status = query.status;
  }

  return ticketRepository.findTickets(filters);
}

export function getTicket(id: number): TicketDetail {
  const ticket = ticketRepository.findTicketById(id);
  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  return toTicketDetail(ticket);
}

export function createTicket(body: Record<string, unknown>): Ticket {
  const title = parseRequiredString(body.title, "title", 1, 200);
  const description = parseRequiredString(body.description, "description", 1, 5000);

  if (!isPriority(body.priority)) {
    throw new ValidationError("priority must be one of Low, Medium, High");
  }

  const createdBy = parseRequiredId(body.createdBy, "createdBy");
  requireExistingUser(createdBy, "createdBy");

  const assignedTo = parseOptionalId(body.assignedTo, "assignedTo");
  if (assignedTo !== undefined && assignedTo !== null) {
    requireExistingUser(assignedTo, "assignedTo");
  }

  if (body.status !== undefined) {
    throw new ValidationError(
      "status cannot be set on create; new tickets start as Open",
    );
  }

  const input: CreateTicketInput = {
    title,
    description,
    priority: body.priority,
    createdBy,
    assignedTo: assignedTo ?? null,
  };

  return ticketRepository.createTicket(input);
}

export function updateTicket(
  id: number,
  body: Record<string, unknown>,
): Ticket {
  if (body.status !== undefined) {
    throw new ValidationError(
      "status cannot be updated via this endpoint; use PATCH /api/tickets/:id/status",
    );
  }

  const updates: UpdateTicketInput = {};
  let hasUpdate = false;

  if (body.title !== undefined) {
    updates.title = parseRequiredString(body.title, "title", 1, 200);
    hasUpdate = true;
  }

  if (body.description !== undefined) {
    updates.description = parseRequiredString(
      body.description,
      "description",
      1,
      5000,
    );
    hasUpdate = true;
  }

  if (body.priority !== undefined) {
    if (!isPriority(body.priority)) {
      throw new ValidationError("priority must be one of Low, Medium, High");
    }
    updates.priority = body.priority;
    hasUpdate = true;
  }

  if (body.assignedTo !== undefined) {
    const assignedTo = parseOptionalId(body.assignedTo, "assignedTo");
    if (assignedTo !== null && assignedTo !== undefined) {
      requireExistingUser(assignedTo, "assignedTo");
    }
    updates.assignedTo = assignedTo ?? null;
    hasUpdate = true;
  }

  if (!hasUpdate) {
    throw new ValidationError(
      "At least one of title, description, priority, or assignedTo is required",
    );
  }

  const updated = ticketRepository.updateTicketFields(id, updates);
  if (!updated) {
    throw new NotFoundError("Ticket not found");
  }

  return updated;
}

export function changeTicketStatus(
  id: number,
  body: Record<string, unknown>,
): Ticket {
  const nextStatus = parseStatus(body.status);
  const ticket = ticketRepository.findTicketById(id);

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  assertValidTransition(ticket.status, nextStatus);

  const updated = ticketRepository.updateTicketStatus(id, nextStatus);
  if (!updated) {
    throw new NotFoundError("Ticket not found");
  }

  return updated;
}
