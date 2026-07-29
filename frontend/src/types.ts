export type TicketPriority = "Low" | "Medium" | "High";
export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed"
  | "Cancelled";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserSummary {
  id: number;
  name: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetail {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  ticketId: number;
  message: string;
  createdBy: UserSummary;
  createdAt: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;
  public readonly from?: string;
  public readonly to?: string;
  public readonly allowed?: string[];

  public constructor(
    message: string,
    status: number,
    extras: {
      details?: unknown;
      from?: string;
      to?: string;
      allowed?: string[];
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = extras.details;
    this.from = extras.from;
    this.to = extras.to;
    this.allowed = extras.allowed;
  }
}

export const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];
export const STATUSES: TicketStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Cancelled",
];

export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  Open: ["In Progress", "Cancelled"],
  "In Progress": ["Resolved", "Cancelled"],
  Resolved: ["Closed"],
  Closed: [],
  Cancelled: [],
};

export const TRANSITION_LABELS: Record<TicketStatus, string> = {
  "In Progress": "Start Progress",
  Resolved: "Mark Resolved",
  Closed: "Close Ticket",
  Cancelled: "Cancel Ticket",
  Open: "Reopen",
};
