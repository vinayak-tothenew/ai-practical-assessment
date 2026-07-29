import type { TicketStatus } from "../types/index.js";
import { InvalidTransitionError, ValidationError } from "../utils/errors.js";

const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  Open: ["In Progress", "Cancelled"],
  "In Progress": ["Resolved", "Cancelled"],
  Resolved: ["Closed"],
  Closed: [],
  Cancelled: [],
};

const ALL_STATUSES: TicketStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Cancelled",
];

export function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === "string" && ALL_STATUSES.includes(value as TicketStatus);
}

export function getAllowedTransitions(status: TicketStatus): TicketStatus[] {
  return [...VALID_TRANSITIONS[status]];
}

export function assertValidTransition(
  from: TicketStatus,
  to: TicketStatus,
): void {
  const allowed = getAllowedTransitions(from);

  if (!allowed.includes(to)) {
    throw new InvalidTransitionError(from, to, allowed);
  }
}

export function parseStatus(value: unknown): TicketStatus {
  if (!isTicketStatus(value)) {
    throw new ValidationError("status must be a valid ticket status", {
      field: "status",
      allowed: ALL_STATUSES,
    });
  }

  return value;
}
