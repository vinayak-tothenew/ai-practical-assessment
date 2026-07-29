import { Router } from "express";

import * as commentController from "../controllers/commentController.js";
import * as ticketController from "../controllers/ticketController.js";

export const ticketsRouter = Router();

ticketsRouter.get("/", ticketController.listTickets);
ticketsRouter.post("/", ticketController.createTicket);

// More specific paths before parameterized "/:id" handlers.
ticketsRouter.patch("/:id/status", ticketController.changeTicketStatus);
ticketsRouter.get("/:id/comments", commentController.listComments);
ticketsRouter.post("/:id/comments", commentController.addComment);

ticketsRouter.get("/:id", ticketController.getTicket);
ticketsRouter.patch("/:id", ticketController.updateTicket);
