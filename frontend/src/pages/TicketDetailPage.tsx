import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import {
  addComment,
  changeTicketStatus,
  getComments,
  getTicket,
  getUsers,
  updateTicket,
} from "../api/client";
import { ErrorBanner, Layout, SuccessBanner } from "../components/Layout";
import {
  ApiError,
  PRIORITIES,
  TRANSITION_LABELS,
  VALID_TRANSITIONS,
  type Comment,
  type TicketDetail,
  type TicketStatus,
  type User,
} from "../types";

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [ticketData, commentData, userData] = await Promise.all([
        getTicket(ticketId),
        getComments(ticketId),
        getUsers(),
      ]);

      setTicket(ticketData);
      setComments(commentData);
      setUsers(userData);
      setTitle(ticketData.title);
      setDescription(ticketData.description);
      setPriority(ticketData.priority);
      setAssignedTo(
        ticketData.assignedTo ? String(ticketData.assignedTo.id) : "",
      );
      if (userData[0] && !commentAuthor) {
        setCommentAuthor(String(userData[0].id));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to load ticket");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      setError("Invalid ticket id");
      setLoading(false);
      return;
    }

    void loadAll();
  }, [ticketId]);

  async function onSaveFields(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await updateTicket(ticketId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedTo: assignedTo ? Number(assignedTo) : null,
      });
      setSuccess("Ticket updated.");
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update ticket");
    } finally {
      setSaving(false);
    }
  }

  async function onStatusChange(nextStatus: TicketStatus) {
    setError(null);
    setSuccess(null);

    try {
      await changeTicketStatus(ticketId, nextStatus);
      setSuccess(`Status changed to ${nextStatus}.`);
      await loadAll();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        const allowed = err.allowed?.join(", ") || "none";
        setError(
          `${err.message} (from ${err.from} to ${err.to}). Allowed: ${allowed}`,
        );
      } else {
        setError(
          err instanceof ApiError ? err.message : "Unable to change status",
        );
      }
    }
  }

  async function onAddComment(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!commentMessage.trim() || !commentAuthor) {
      setError("Comment message and author are required.");
      return;
    }

    try {
      await addComment(ticketId, {
        message: commentMessage.trim(),
        createdBy: Number(commentAuthor),
      });
      setCommentMessage("");
      setSuccess("Comment added.");
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to add comment");
    }
  }

  const allowedTransitions = ticket
    ? VALID_TRANSITIONS[ticket.status]
    : [];

  return (
    <Layout
      title={ticket ? `Ticket #${ticket.id}` : "Ticket Detail"}
      actions={
        <Link className="button" to="/">
          Back to List
        </Link>
      }
    >
      {error ? <ErrorBanner message={error} /> : null}
      {success ? <SuccessBanner message={success} /> : null}
      {loading ? <p className="muted">Loading ticket…</p> : null}

      {!loading && ticket ? (
        <>
          <section className="panel">
            <div className="status-row">
              <div>
                <p className="muted">Current status</p>
                <strong className="status-pill">{ticket.status}</strong>
              </div>
              <div className="status-actions">
                {allowedTransitions.length === 0 ? (
                  <p className="muted">No further status transitions allowed.</p>
                ) : (
                  allowedTransitions.map((next) => (
                    <button
                      key={next}
                      className="button"
                      type="button"
                      onClick={() => void onStatusChange(next)}
                    >
                      {TRANSITION_LABELS[next]}
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          <form className="form-card" onSubmit={onSaveFields}>
            <label>
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                required
              />
            </label>
            <label>
              Priority
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
              Assignee
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
            <div className="meta-grid">
              <div>
                <span className="muted">Created by</span>
                <p>{ticket.createdBy.name}</p>
              </div>
              <div>
                <span className="muted">Created</span>
                <p>{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <span className="muted">Updated</span>
                <p>{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
            <div className="form-actions">
              <button className="button primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>

          <section className="panel">
            <h2>Comments</h2>
            {comments.length === 0 ? (
              <p className="muted">No comments yet.</p>
            ) : (
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <div className="comment-meta">
                      <strong>{comment.createdBy.name}</strong>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p>{comment.message}</p>
                  </li>
                ))}
              </ul>
            )}

            <form className="comment-form" onSubmit={onAddComment}>
              <label>
                Posted as
                <select
                  value={commentAuthor}
                  onChange={(event) => setCommentAuthor(event.target.value)}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Add comment
                <textarea
                  value={commentMessage}
                  onChange={(event) => setCommentMessage(event.target.value)}
                  rows={3}
                  required
                />
              </label>
              <button className="button primary" type="submit">
                Post Comment
              </button>
            </form>
          </section>
        </>
      ) : null}
    </Layout>
  );
}
