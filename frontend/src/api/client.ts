import { ApiError, type Comment, type Ticket, type TicketDetail, type User } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    data?: T;
    error?: string;
    details?: unknown;
    from?: string;
    to?: string;
    allowed?: string[];
  };

  if (!response.ok) {
    throw new ApiError(payload.error ?? "Request failed", response.status, {
      details: payload.details,
      from: payload.from,
      to: payload.to,
      allowed: payload.allowed,
    });
  }

  return payload.data as T;
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export function getTickets(params: {
  search?: string;
  status?: string;
}): Promise<Ticket[]> {
  const query = new URLSearchParams();
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.status) {
    query.set("status", params.status);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<Ticket[]>(`/tickets${suffix}`);
}

export function getTicket(id: number): Promise<TicketDetail> {
  return request<TicketDetail>(`/tickets/${id}`);
}

export function createTicket(body: {
  title: string;
  description: string;
  priority: string;
  createdBy: number;
  assignedTo?: number | null;
}): Promise<Ticket> {
  return request<Ticket>("/tickets", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateTicket(
  id: number,
  body: {
    title?: string;
    description?: string;
    priority?: string;
    assignedTo?: number | null;
  },
): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function changeTicketStatus(
  id: number,
  status: string,
): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getComments(ticketId: number): Promise<Comment[]> {
  return request<Comment[]>(`/tickets/${ticketId}/comments`);
}

export function addComment(
  ticketId: number,
  body: { message: string; createdBy: number },
): Promise<Comment> {
  return request<Comment>(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
