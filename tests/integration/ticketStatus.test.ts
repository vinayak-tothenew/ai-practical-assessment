import request from "supertest";

import {
  changeStatus,
  createTicket,
  setTicketStatusDirect,
  setupTestApp,
  teardownTestApp,
  type TestContext,
} from "./helpers.js";

describe("Ticket status state machine (integration)", () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupTestApp();
  });

  afterEach(() => {
    teardownTestApp(ctx.databasePath);
  });

  describe("valid transitions", () => {
    test("Open → In Progress", async () => {
      const ticket = await createTicket(ctx.app);
      const response = await changeStatus(ctx.app, ticket.id, "In Progress");

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("In Progress");
    });

    test("In Progress → Resolved", async () => {
      const ticket = await createTicket(ctx.app);
      await changeStatus(ctx.app, ticket.id, "In Progress").expect(200);

      const response = await changeStatus(ctx.app, ticket.id, "Resolved");

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("Resolved");
    });

    test("Resolved → Closed", async () => {
      const ticket = await createTicket(ctx.app);
      await changeStatus(ctx.app, ticket.id, "In Progress").expect(200);
      await changeStatus(ctx.app, ticket.id, "Resolved").expect(200);

      const response = await changeStatus(ctx.app, ticket.id, "Closed");

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("Closed");
    });

    test("Open → Cancelled", async () => {
      const ticket = await createTicket(ctx.app);
      const response = await changeStatus(ctx.app, ticket.id, "Cancelled");

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("Cancelled");
    });

    test("In Progress → Cancelled", async () => {
      const ticket = await createTicket(ctx.app);
      await changeStatus(ctx.app, ticket.id, "In Progress").expect(200);

      const response = await changeStatus(ctx.app, ticket.id, "Cancelled");

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("Cancelled");
    });
  });

  describe("invalid transitions", () => {
    test("Open → Resolved is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      const response = await changeStatus(ctx.app, ticket.id, "Resolved");

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        error: "Invalid status transition",
        from: "Open",
        to: "Resolved",
        allowed: ["In Progress", "Cancelled"],
      });
    });

    test("Open → Closed is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      const response = await changeStatus(ctx.app, ticket.id, "Closed");

      expect(response.status).toBe(422);
      expect(response.body.from).toBe("Open");
      expect(response.body.to).toBe("Closed");
      expect(response.body.allowed).toEqual(["In Progress", "Cancelled"]);
    });

    test("In Progress → Open is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      await changeStatus(ctx.app, ticket.id, "In Progress").expect(200);

      const response = await changeStatus(ctx.app, ticket.id, "Open");

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        from: "In Progress",
        to: "Open",
        allowed: ["Resolved", "Cancelled"],
      });
    });

    test("Resolved → In Progress is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      await changeStatus(ctx.app, ticket.id, "In Progress").expect(200);
      await changeStatus(ctx.app, ticket.id, "Resolved").expect(200);

      const response = await changeStatus(ctx.app, ticket.id, "In Progress");

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        from: "Resolved",
        to: "In Progress",
        allowed: ["Closed"],
      });
    });

    test("Closed → Open is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      setTicketStatusDirect(ticket.id, "Closed");

      const response = await changeStatus(ctx.app, ticket.id, "Open");

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        from: "Closed",
        to: "Open",
        allowed: [],
      });
    });

    test("Cancelled → In Progress is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      setTicketStatusDirect(ticket.id, "Cancelled");

      const response = await changeStatus(ctx.app, ticket.id, "In Progress");

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        from: "Cancelled",
        to: "In Progress",
        allowed: [],
      });
    });

    test("same-status transition is rejected with 422", async () => {
      const ticket = await createTicket(ctx.app);
      const response = await changeStatus(ctx.app, ticket.id, "Open");

      expect(response.status).toBe(422);
      expect(response.body.from).toBe("Open");
      expect(response.body.to).toBe("Open");
    });
  });

  describe("status endpoint authority", () => {
    test("general PATCH cannot change status", async () => {
      const ticket = await createTicket(ctx.app);

      const response = await request(ctx.app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({ status: "In Progress" });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/status cannot be updated/i);

      const current = await request(ctx.app).get(`/api/tickets/${ticket.id}`);
      expect(current.body.data.status).toBe("Open");
    });
  });
});
