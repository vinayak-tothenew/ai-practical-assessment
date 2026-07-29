export type UserRole = "admin" | "agent" | "user";
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
  role: UserRole;
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
  createdBy: number;
  createdAt: string;
}

export interface CommentDetail {
  id: number;
  ticketId: number;
  message: string;
  createdBy: UserSummary;
  createdAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  createdBy: number;
  assignedTo?: number | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: number | null;
}

export interface CreateCommentInput {
  message: string;
  createdBy: number;
}

export interface TicketListQuery {
  search?: string;
  status?: TicketStatus;
}

export interface TicketRow {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CommentRow {
  id: number;
  ticket_id: number;
  message: string;
  created_by: number;
  created_at: string;
}
