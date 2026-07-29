# API Contract

**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`

---

## Users

### List users (for assignee/creator dropdowns)

**Method:** `GET`  
**Path:** `/users`  
**Purpose:** Return seeded users

#### Response `200`
```json
{
  "data": [
    { "id": 1, "name": "Alice Admin", "email": "alice@example.com", "role": "admin" }
  ]
}
```

---

## Tickets

### Create ticket

**Method:** `POST`  
**Path:** `/tickets`  
**Purpose:** Create a new ticket (status defaults to `Open`)

#### Request
```json
{
  "title": "Cannot login",
  "description": "User reports 500 error on login page",
  "priority": "High",
  "createdBy": 1,
  "assignedTo": 2
}
```

#### Response `201`
```json
{
  "data": {
    "id": 1,
    "title": "Cannot login",
    "description": "User reports 500 error on login page",
    "priority": "High",
    "status": "Open",
    "assignedTo": 2,
    "createdBy": 1,
    "createdAt": "2026-07-29T10:00:00.000Z",
    "updatedAt": "2026-07-29T10:00:00.000Z"
  }
}
```

#### Validation Rules
- `title`: required, string, 1–200 chars
- `description`: required, string, 1–5000 chars
- `priority`: required, one of `Low` | `Medium` | `High`
- `createdBy`: required, valid user ID
- `assignedTo`: optional, valid user ID if provided

#### Error Responses
- `400` — validation failure
- `404` — createdBy or assignedTo user not found

---

### List tickets

**Method:** `GET`  
**Path:** `/tickets`  
**Purpose:** List tickets with optional search and status filter

#### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Keyword match on title and description (case-insensitive) |
| `status` | string | Filter by exact status value |

#### Response `200`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Cannot login",
      "description": "User reports 500 error on login page",
      "priority": "High",
      "status": "Open",
      "assignedTo": 2,
      "createdBy": 1,
      "createdAt": "2026-07-29T10:00:00.000Z",
      "updatedAt": "2026-07-29T10:00:00.000Z"
    }
  ]
}
```

---

### Get ticket by ID

**Method:** `GET`  
**Path:** `/tickets/:id`  
**Purpose:** Ticket detail including metadata

#### Response `200`
```json
{
  "data": {
    "id": 1,
    "title": "Cannot login",
    "description": "...",
    "priority": "High",
    "status": "Open",
    "assignedTo": { "id": 2, "name": "Bob Agent" },
    "createdBy": { "id": 1, "name": "Alice Admin" },
    "createdAt": "2026-07-29T10:00:00.000Z",
    "updatedAt": "2026-07-29T10:00:00.000Z"
  }
}
```

#### Error Responses
- `404` — ticket not found

---

### Update ticket fields

**Method:** `PATCH`  
**Path:** `/tickets/:id`  
**Purpose:** Update title, description, priority, or assignee (NOT status)

#### Request
```json
{
  "title": "Updated title",
  "priority": "Medium",
  "assignedTo": 3
}
```

#### Response `200`
```json
{ "data": { /* updated ticket */ } }
```

#### Validation Rules
- At least one field required in body
- Cannot include `status` field (use status endpoint)
- Normal field updates remain allowed for all ticket statuses

#### Error Responses
- `400` — validation failure
- `404` — ticket or user not found

---

### Change ticket status

**Method:** `PATCH`  
**Path:** `/tickets/:id/status`  
**Purpose:** Transition ticket status via state machine

#### Request
```json
{
  "status": "In Progress"
}
```

#### Response `200`
```json
{ "data": { /* ticket with new status */ } }
```

#### Validation Rules
- `status`: required, valid enum value
- Transition must be valid per state machine

#### Error Responses
- `404` — ticket not found
- `422` — invalid status transition
```json
{
  "error": "Invalid status transition",
  "from": "Open",
  "to": "Resolved",
  "allowed": ["In Progress", "Cancelled"]
}
```

---

## Comments

### List comments for a ticket

**Method:** `GET`  
**Path:** `/tickets/:id/comments`  
**Purpose:** Comments ordered by createdAt ascending

#### Response `200`
```json
{
  "data": [
    {
      "id": 1,
      "ticketId": 1,
      "message": "Investigating the issue",
      "createdBy": { "id": 2, "name": "Bob Agent" },
      "createdAt": "2026-07-29T11:00:00.000Z"
    }
  ]
}
```

---

### Add comment

**Method:** `POST`  
**Path:** `/tickets/:id/comments`  
**Purpose:** Add a comment to a ticket

#### Request
```json
{
  "message": "Investigating the issue",
  "createdBy": 2
}
```

#### Response `201`
```json
{ "data": { /* comment */ } }
```

#### Validation Rules
- `message`: required, 1–2000 chars
- `createdBy`: required, valid user ID

#### Error Responses
- `400` — validation failure
- `404` — ticket or user not found

---

## Health Check

**Method:** `GET`  
**Path:** `/health`  
**Purpose:** Verify API is running

#### Response `200`
```json
{ "status": "ok" }
```
