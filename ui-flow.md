# UI Flow

## Routes

| Route | Screen | Purpose |
|-------|--------|---------|
| `/` | Ticket List | Browse, search, filter tickets |
| `/tickets/new` | Create Ticket | New ticket form |
| `/tickets/:id` | Ticket Detail | View/edit ticket, change status, comments |

## Screen Flows

### 1. Ticket List (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│  Support Tickets                          [+ Create Ticket]   │
├─────────────────────────────────────────────────────────────┤
│  Search: [________________]   Status: [All ▼]   [Apply]    │
├─────────────────────────────────────────────────────────────┤
│  Title          │ Priority │ Status      │ Assignee │ Updated│
│  Cannot login   │ High     │ Open        │ Bob      │ 2h ago │
│  Slow dashboard │ Medium   │ In Progress │ Alice    │ 1d ago │
│  ...            │          │             │          │        │
└─────────────────────────────────────────────────────────────┘
         │ click row
         ▼
    Ticket Detail
```

**Actions:**
- Type keyword → triggers search (debounced or on submit)
- Select status filter → reloads list
- Click row → navigate to `/tickets/:id`
- Click "Create Ticket" → navigate to `/tickets/new`

**Empty state:** "No tickets found" when search/filter returns zero results.

**Error state:** Banner if API call fails.

---

### 2. Create Ticket (`/tickets/new`)

```
┌─────────────────────────────────────────────────────────────┐
│  Create Ticket                              [← Back to List]│
├─────────────────────────────────────────────────────────────┤
│  Title *        [________________________________]          │
│  Description *  [________________________________]          │
│                 [________________________________]          │
│  Priority *     [Medium ▼]                                  │
│  Created by *   [Alice Admin ▼]   (seeded users)            │
│  Assign to      [Unassigned ▼]                              │
│                                                             │
│                              [Cancel]  [Create Ticket]      │
└─────────────────────────────────────────────────────────────┘
```

**On success:** Redirect to `/tickets/:id`  
**On validation error:** Inline field errors from API response  
**On API error:** Banner with error message

---

### 3. Ticket Detail (`/tickets/:id`)

```
┌─────────────────────────────────────────────────────────────┐
│  Ticket #42: Cannot login                   [← Back to List]│
├─────────────────────────────────────────────────────────────┤
│  Status: [Open]                                             │
│                                                             │
│  Available actions: [Start Progress]  [Cancel Ticket]       │
│  (only valid transitions shown based on current status)     │
│                                                             │
│  Title        [Cannot login________________]  [Save]        │
│  Description  [User reports 500 error...]     [Save]        │
│  Priority     [High ▼]                        [Save]        │
│  Assignee     [Bob Agent ▼]                   [Save]        │
│  Created by   Alice Admin                                   │
│  Created      Jul 29, 2026 10:00 AM                         │
│  Updated      Jul 29, 2026 2:00 PM                          │
├─────────────────────────────────────────────────────────────┤
│  Comments                                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Bob Agent — Jul 29, 11:00 AM                        │    │
│  │ Investigating the login endpoint                    │    │
│  └─────────────────────────────────────────────────────┘    │
│  Add comment: [________________________] [Post]             │
│  Posted as: [Bob Agent ▼]                                   │
└─────────────────────────────────────────────────────────────┘
```

**Status actions by current status:**

| Current Status | Buttons shown |
|----------------|---------------|
| Open | "Start Progress" (→ In Progress), "Cancel Ticket" (→ Cancelled) |
| In Progress | "Mark Resolved" (→ Resolved), "Cancel Ticket" (→ Cancelled) |
| Resolved | "Close Ticket" (→ Closed) |
| Closed | (none — normal fields remain editable) |
| Cancelled | (none — normal fields remain editable) |

**Invalid transition attempt:** Show error banner with message from API (422 response).

**Terminal status (Closed/Cancelled):**
- Status action buttons hidden
- Normal field inputs remain editable
- Comments still allowed

---

## Component Map

```
App
├── Layout (header, nav)
├── TicketListPage
│   ├── SearchBar
│   ├── StatusFilter
│   └── TicketTable / TicketRow
├── CreateTicketPage
│   └── TicketForm
└── TicketDetailPage
    ├── TicketFields (editable)
    ├── StatusActions
    ├── CommentList
    └── CommentForm
```

## API Calls per Screen

| Screen | API calls |
|--------|-----------|
| List | `GET /api/tickets?search=&status=` |
| Create | `GET /api/users`, `POST /api/tickets` |
| Detail | `GET /api/tickets/:id`, `GET /api/tickets/:id/comments`, `GET /api/users` |
| Detail actions | `PATCH /api/tickets/:id`, `PATCH /api/tickets/:id/status`, `POST /api/tickets/:id/comments` |

## Error States Summary

| Scenario | UI behavior |
|----------|-------------|
| Network failure | Banner: "Unable to connect to server" |
| 400 validation | Inline field errors |
| 404 not found | Redirect to list with "Ticket not found" message |
| 422 invalid transition | Banner with transition error and allowed options |
