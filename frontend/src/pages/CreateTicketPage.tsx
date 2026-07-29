import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createTicket, getUsers } from "../api/client";
import { ErrorBanner, Layout } from "../components/Layout";
import { ApiError, PRIORITIES, type User } from "../types";

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [createdBy, setCreatedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        if (data[0]) {
          setCreatedBy(String(data[0].id));
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load users");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !createdBy) {
      setError("Title, description, and created by are required.");
      return;
    }

    setSubmitting(true);

    try {
      const ticket = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        createdBy: Number(createdBy),
        assignedTo: assignedTo ? Number(assignedTo) : null,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout
      title="Create Ticket"
      actions={
        <Link className="button" to="/">
          Back to List
        </Link>
      }
    >
      {error ? <ErrorBanner message={error} /> : null}
      {loadingUsers ? <p className="muted">Loading users…</p> : null}

      <form className="form-card" onSubmit={onSubmit}>
        <label>
          Title *
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={200}
          />
        </label>
        <label>
          Description *
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={5}
            maxLength={5000}
          />
        </label>
        <label>
          Priority *
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Created by *
          <select
            value={createdBy}
            onChange={(event) => setCreatedBy(event.target.value)}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assign to
          <select
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <Link className="button" to="/">
            Cancel
          </Link>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create Ticket"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
