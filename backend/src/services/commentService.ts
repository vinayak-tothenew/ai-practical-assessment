import * as commentRepository from "../repositories/commentRepository.js";
import * as ticketRepository from "../repositories/ticketRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import type { CommentDetail } from "../types/index.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

function toCommentDetail(comment: {
  id: number;
  ticketId: number;
  message: string;
  createdBy: number;
  createdAt: string;
}): CommentDetail {
  const user = userRepository.findUserById(comment.createdBy);

  if (!user) {
    throw new NotFoundError("createdBy user not found");
  }

  return {
    id: comment.id,
    ticketId: comment.ticketId,
    message: comment.message,
    createdBy: { id: user.id, name: user.name },
    createdAt: comment.createdAt,
  };
}

export function listComments(ticketId: number): CommentDetail[] {
  if (!ticketRepository.findTicketById(ticketId)) {
    throw new NotFoundError("Ticket not found");
  }

  return commentRepository
    .findCommentsByTicketId(ticketId)
    .map(toCommentDetail);
}

export function addComment(
  ticketId: number,
  body: Record<string, unknown>,
): CommentDetail {
  if (!ticketRepository.findTicketById(ticketId)) {
    throw new NotFoundError("Ticket not found");
  }

  if (typeof body.message !== "string") {
    throw new ValidationError("message is required");
  }

  const message = body.message.trim();
  if (message.length < 1 || message.length > 2000) {
    throw new ValidationError("message must be between 1 and 2000 characters");
  }

  const createdBy = Number(body.createdBy);
  if (!Number.isInteger(createdBy) || createdBy <= 0) {
    throw new ValidationError(
      "createdBy is required and must be a positive integer",
    );
  }

  if (!userRepository.findUserById(createdBy)) {
    throw new NotFoundError("createdBy user not found");
  }

  const comment = commentRepository.createComment(ticketId, {
    message,
    createdBy,
  });

  return toCommentDetail(comment);
}
