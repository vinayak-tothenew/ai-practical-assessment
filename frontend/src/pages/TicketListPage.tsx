import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getTickets, getUsers } from "../api/client";
import { ErrorBanner, Layout } from "../components/Layout";
import { ApiError, STATUSES, type Ticket, type User } from "../types";

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

function assigneeName(ticket: Ticket, users: User[]): string {
  if (ticket.assignedTo === null) {
    return "Unassigned";
  }

  return users.find((user) => user.id === ticket.assignedTo)?.name ?? `User #${ticket.assignedTo}`;
}

export function TicketListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTickets(nextSearch: string, nextStatus: string) {
    setLoading(true);
    setError(null);

    try {
      const [ticketData, userData] = await Promise.all([
        getTickets({ search: nextSearch, status: nextStatus }),
        getUsers(),
      ]);
      setTickets(ticketData);
      setUsers(userData);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to load tickets";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialSearch = searchParams.get("search") ?? "";
    const initialStatus = searchParams.get("status") ?? "";
    setSearch(initialSearch);
    setStatus(initialStatus);
    void loadTickets(initialSearch, initialStatus);
  }, [searchParams]);

  function onFilter(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (status) {
      params.set("status", status);
    }
    setSearchParams(params);
    void loadTickets(search, status);
  }

  return (
    <Layout
      title="Ticket List"
      actions={
        <Link className="button primary" to="/tickets/new">
          Create Ticket
        </Link>
      }
    >
      <form className="filters" onSubmit={onFilter}>
        <label>
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or description"
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          Apply
        </button>
      </form>

      {error ? <ErrorBanner message={error} /> : null}
      {loading ? <p className="muted">Loading tickets…</p> : null}

      {!loading && !error && tickets.length === 0 ? (
        <p className="empty-state">No tickets found.</p>
      ) : null}

      {!loading && tickets.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <td>{ticket.title}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>{assigneeName(ticket, users)}</td>
                  <td>{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Layout>
  );
}
