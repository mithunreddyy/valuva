# 🎧 Support & Returns Module

**Complete documentation for support tickets, return requests, and customer service files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/support/
├── support.service.ts            # Support ticket business logic
├── support.controller.ts         # HTTP request handlers
└── support.routes.ts             # Express route definitions

backend/src/modules/returns/
├── returns.service.ts            # Return request business logic
├── returns.controller.ts        # HTTP request handlers
└── returns.routes.ts             # Express route definitions
```

---

## 🎧 Support Service

### **File**: `support.service.ts`

**Purpose**: Customer support ticket management

### **Class**: `SupportService`

---

### **Methods**

#### **1. `createTicket()`**

**Purpose**: Create new support ticket

**Parameters**:

- `userId: string` - User ID
- `subject: string` - Ticket subject
- `message: string` - Ticket message
- `category: string` - Ticket category

**Returns**: `Promise<SupportTicket>` - Created ticket

**Features**:

- ✅ Creates ticket with OPEN status
- ✅ Links to user
- ✅ Stores category for routing

**Example**:

```typescript
const ticket = await supportService.createTicket(
  userId,
  "Order Issue",
  "My order hasn't arrived",
  "ORDER"
);
```

---

#### **2. `getUserTickets()`**

**Purpose**: Get user's support tickets

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<SupportTicket[]>` - User tickets

**Features**:

- ✅ Includes all replies
- ✅ Sorted by creation date (newest first)
- ✅ Only user's own tickets

**Example**:

```typescript
const tickets = await supportService.getUserTickets(userId);
```

---

#### **3. `getTicketById()`**

**Purpose**: Get ticket details

**Parameters**:

- `ticketId: string` - Ticket ID
- `userId?: string` - User ID (for authorization)

**Returns**: `Promise<SupportTicket>` - Ticket with replies

**Features**:

- ✅ Includes user information
- ✅ Includes all replies
- ✅ User authorization check (users can only see own tickets)
- ✅ Admin can see all tickets

**Throws**:

- `NotFoundError` if ticket not found
- `NotFoundError` if user doesn't have access

**Example**:

```typescript
const ticket = await supportService.getTicketById("ticket_123", userId);
```

---

#### **4. `addReply()`**

**Purpose**: Add reply to ticket

**Parameters**:

- `ticketId: string` - Ticket ID
- `userId: string` - User ID
- `message: string` - Reply message
- `isAdmin: boolean` - Whether reply is from admin (default: false)

**Returns**: `Promise<TicketReply>` - Created reply

**Features**:

- ✅ Creates reply linked to ticket
- ✅ Updates ticket status to IN_PROGRESS if admin replies
- ✅ Includes user information in reply

**Throws**: `NotFoundError` if ticket not found

**Example**:

```typescript
const reply = await supportService.addReply(
  "ticket_123",
  userId,
  "Thank you for your inquiry. We're looking into it.",
  false
);
```

---

#### **5. `getAllTickets()`** (Admin)

**Purpose**: Get all support tickets (Admin)

**Parameters**:

- `page: number` - Page number (default: 1)
- `limit: number` - Items per page (default: 50)

**Returns**: `Promise<{ data: SupportTicket[], pagination: Pagination }>`

**Features**:

- ✅ Admin-only operation
- ✅ Pagination support
- ✅ Includes user information
- ✅ Sorted by creation date

**Example**:

```typescript
const { data: tickets, pagination } = await supportService.getAllTickets(1, 50);
```

---

#### **6. `updateTicketStatus()`** (Admin)

**Purpose**: Update ticket status

**Parameters**:

- `ticketId: string` - Ticket ID
- `status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"` - New status

**Returns**: `Promise<SupportTicket>` - Updated ticket

**Features**:

- ✅ Admin-only operation
- ✅ Status transition validation
- ✅ Updates ticket status

**Throws**: `NotFoundError` if ticket not found

**Example**:

```typescript
const ticket = await supportService.updateTicketStatus("ticket_123", "RESOLVED");
```

---

## 🎮 Support Controller

### **File**: `support.controller.ts`

**Purpose**: HTTP request handlers for support

### **Methods**

#### **1. `createTicket`**

- **Route**: `POST /api/v1/support`
- **Authentication**: Required
- **Body**: `{ subject, message, category }`
- **Handler**: Calls `supportService.createTicket()`
- **Response**: Created ticket (201 Created)

#### **2. `getTickets`**

- **Route**: `GET /api/v1/support`
- **Authentication**: Required
- **Handler**: Calls `supportService.getUserTickets()`
- **Response**: User tickets array

#### **3. `getTicket`**

- **Route**: `GET /api/v1/support/:id`
- **Authentication**: Required
- **Handler**: Calls `supportService.getTicketById()`
- **Response**: Ticket details

#### **4. `addReply`**

- **Route**: `POST /api/v1/support/:id/reply`
- **Authentication**: Required
- **Body**: `{ message }`
- **Handler**: Calls `supportService.addReply()`
- **Response**: Created reply (201 Created)

---

## 🛣️ Support Routes

### **File**: `support.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user tickets
POST   /                    # Create ticket
GET    /:id                 # Get ticket details
POST   /:id/reply           # Add reply to ticket
```

**All routes require authentication**

---

## 🔄 Returns Service

### **File**: `returns.service.ts`

**Purpose**: Product return request management

### **Class**: `ReturnsService`

---

### **Methods**

#### **1. `createReturnRequest()`**

**Purpose**: Create return request

**Parameters**:

- `userId: string` - User ID
- `orderId: string` - Order ID
- `orderItemIds: string[]` - Order item IDs to return
- `reason: string` - Return reason
- `description?: string` - Optional description

**Returns**: `Promise<ReturnRequest>` - Created return request

**Features**:

- ✅ Validates order belongs to user
- ✅ Validates order is DELIVERED
- ✅ Prevents duplicate return requests
- ✅ Stores item IDs as JSON
- ✅ Sets status to PENDING

**Throws**:

- `NotFoundError` if order not found
- `ValidationError` if order not delivered
- `ValidationError` if return already exists

**Example**:

```typescript
const returnRequest = await returnsService.createReturnRequest(
  userId,
  "order_123",
  ["item_1", "item_2"],
  "DEFECTIVE",
  "Product arrived damaged"
);
```

---

#### **2. `getUserReturns()`**

**Purpose**: Get user's return requests

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<ReturnRequest[]>` - User returns

**Features**:

- ✅ Includes order and item details
- ✅ Includes product information
- ✅ Sorted by creation date (newest first)

**Example**:

```typescript
const returns = await returnsService.getUserReturns(userId);
```

---

#### **3. `getAllReturns()`** (Admin)

**Purpose**: Get all return requests (Admin)

**Parameters**:

- `page: number` - Page number (default: 1)
- `limit: number` - Items per page (default: 50)

**Returns**: `Promise<{ data: ReturnRequest[], pagination: Pagination }>`

**Features**:

- ✅ Admin-only operation
- ✅ Pagination support
- ✅ Includes user and order information

**Example**:

```typescript
const { data: returns, pagination } = await returnsService.getAllReturns(1, 50);
```

---

#### **4. `updateReturnStatus()`** (Admin)

**Purpose**: Update return request status

**Parameters**:

- `returnId: string` - Return request ID
- `status: "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED"` - New status
- `adminNotes?: string` - Admin notes

**Returns**: `Promise<ReturnRequest>` - Updated return request

**Features**:

- ✅ Admin-only operation
- ✅ Status transition validation
- ✅ Stores admin notes

**Throws**: `NotFoundError` if return request not found

**Example**:

```typescript
const returnRequest = await returnsService.updateReturnStatus(
  "return_123",
  "APPROVED",
  "Return approved. Please ship items back."
);
```

---

## 🎮 Returns Controller

### **File**: `returns.controller.ts`

**Purpose**: HTTP request handlers for returns

### **Methods**

#### **1. `createReturn`**

- **Route**: `POST /api/v1/returns`
- **Authentication**: Required
- **Body**: `{ orderId, orderItemIds, reason, description? }`
- **Handler**: Calls `returnsService.createReturnRequest()`
- **Response**: Created return request (201 Created)

#### **2. `getReturns`**

- **Route**: `GET /api/v1/returns`
- **Authentication**: Required
- **Handler**: Calls `returnsService.getUserReturns()`
- **Response**: User returns array

#### **3. `getReturn`**

- **Route**: `GET /api/v1/returns/:id`
- **Authentication**: Required
- **Handler**: Calls `returnsService.getReturnById()`
- **Response**: Return request details

---

## 🛣️ Returns Routes

### **File**: `returns.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user returns
POST   /                    # Create return request
GET    /:id                 # Get return details
```

**All routes require authentication**

---

## 📊 Database Models

### **SupportTicket Model** (Prisma)

- `id`, `userId`, `subject`, `message`, `category`
- `status` (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `createdAt`, `updatedAt`
- Relations: `user`, `replies`

### **TicketReply Model** (Prisma)

- `id`, `ticketId`, `userId`, `message`
- `isAdmin` - Whether reply is from admin
- `createdAt`
- Relations: `ticket`, `user`

### **ReturnRequest Model** (Prisma)

- `id`, `userId`, `orderId`
- `orderItemIds` - JSON string of item IDs
- `reason`, `description`
- `status` (PENDING, APPROVED, REJECTED, PROCESSING, COMPLETED)
- `adminNotes`
- `createdAt`, `updatedAt`
- Relations: `user`, `order`

---

## 🔍 Features

### **Support Features**

1. **Ticket Management**: Create, view, reply to tickets
2. **Categories**: Ticket categorization
3. **Status Tracking**: OPEN → IN_PROGRESS → RESOLVED → CLOSED
4. **Admin Access**: Admins can view all tickets
5. **Reply System**: Threaded conversation
6. **Auto Status Update**: Status updates on admin reply

### **Returns Features**

1. **Return Requests**: Create return for delivered orders
2. **Item Selection**: Select specific items to return
3. **Reason Tracking**: Return reason categorization
4. **Status Management**: PENDING → APPROVED/REJECTED → PROCESSING → COMPLETED
5. **Admin Notes**: Admin can add notes
6. **Duplicate Prevention**: One active return per order

---

## 📝 Usage Examples

### **Create Support Ticket**

```http
POST /api/v1/support
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Order Issue",
  "message": "My order hasn't arrived",
  "category": "ORDER"
}
```

### **Add Reply**

```http
POST /api/v1/support/ticket_123/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "We're looking into your order. Will update you soon."
}
```

### **Create Return Request**

```http
POST /api/v1/returns
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_123",
  "orderItemIds": ["item_1", "item_2"],
  "reason": "DEFECTIVE",
  "description": "Products arrived damaged"
}
```

---

## 🔗 Related Files

- **Orders**: `modules/orders/orders.service.ts` - Order validation
- **Users**: `modules/users/users.service.ts` - User information
- **Email**: `utils/email.util.ts` - Notification emails

---

**Last Updated**: January 2025

