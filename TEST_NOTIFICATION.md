# Test Notification System

## Bước 1: Check Backend Running

Mở terminal backend và đảm bảo server đang chạy:

```bash
cd SUGAR_PAWS_BE
npm run start:dev
```

Xem console logs, phải thấy:

- ✅ Application is running on: http://localhost:5000
- ✅ Database connected

## Bước 2: Test Socket Connection

Mở frontend và login với user account (không phải admin).

Mở Console (F12) và kiểm tra logs:

```
✅ Socket connected: <socketId>
```

Nếu thấy `❌ Socket disconnected` hoặc không có log gì, check:

1. Backend có chạy không
2. Port 5000 có bị block không
3. CORS config

## Bước 3: Test Manual Notification

Mở Postman hoặc Thunder Client, gửi request tạo notification thủ công:

```http
POST http://localhost:5000/api/notifications/test
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": 1,
  "title": "Test Notification",
  "message": "This is a test",
  "type": "SYSTEM"
}
```

Nếu user tab có toast xuất hiện → Socket hoạt động ✅

## Bước 4: Test Order Status Change

1. **Login với user account** → Tạo order
2. **Login admin (tab khác)** → `/admin/orders`
3. **Update order status** từ PENDING → CONFIRMED
4. **Quay lại user tab** → Phải thấy toast notification

## Debug Checklist

### Frontend Console Logs Cần Thấy:

```javascript
✅ Socket connected: abc123
🔔 New notification: {id: 1, title: "...", message: "..."}
```

### Backend Console Logs Cần Thấy:

```
✅ Client connected: abc123
🔔 User 1 registered with socket abc123
🔔 Emitted notification to user 1
```

### Nếu Frontend Không Thấy "Socket connected":

- Check NEXT_PUBLIC_API_URL trong .env.local
- Restart dev server frontend
- Clear browser cache
- Check Network tab → WebSocket connection failed?

### Nếu Backend Không Thấy "User registered":

- User có login chưa? (localStorage có "user")
- userId trong localStorage đúng chưa?
- Check frontend SocketProvider console.log

### Nếu "Emitted" nhưng Frontend không nhận:

- Check socketId có khớp không
- Verify event name: phải là "notification"
- Check socket.on("notification") trong SocketProvider

## Common Issues

### Issue 1: Socket không connect

**Nguyên nhân:** CORS hoặc port sai
**Fix:**

- Verify backend port = 5000
- Check CORS trong websocket.gateway.ts
- Thử thay đổi transports order

### Issue 2: Register event không gửi

**Nguyên nhân:** User chưa login hoặc localStorage empty
**Fix:**

- Login lại
- Check localStorage: `localStorage.getItem("user")`
- Verify user.id exists

### Issue 3: Notification được tạo nhưng không emit

**Nguyên nhân:** WebSocketGateway không inject đúng
**Fix:**

- Check NotificationModule exports WebSocketModule
- Verify WebSocketGatewayService inject trong NotificationService

### Issue 4: Toast không hiển thị

**Nguyên nhân:** toast.success syntax sai
**Fix:** ✅ Đã fix - dùng template string thay vì description

## Manual Test Script

Copy đoạn này vào browser console (frontend):

```javascript
// Test 1: Check Socket
const socket = window.__socket; // Nếu bạn expose socket
console.log("Socket connected?", socket?.connected);

// Test 2: Check localStorage
const user = JSON.parse(localStorage.getItem("user") || "null");
console.log("User ID:", user?.id);

// Test 3: Manually trigger toast
toast.success("Test Toast", { duration: 3000 });
```

## Backend Debug Endpoints

Thêm test endpoint vào NotificationController:

```typescript
@Get('test/:userId')
async testNotification(@Param('userId') userId: string) {
  await this.notificationService.createNotification({
    userId: parseInt(userId),
    title: 'Test Notification',
    message: 'Testing realtime notification',
    type: 'SYSTEM'
  });
  return { success: true };
}
```

Sau đó call: `GET http://localhost:5000/api/notifications/test/1`

## Expected Flow

1. Admin updates order status
2. OrderService.updateOrderStatus() called
3. NotificationService.createNotification() called
4. Notification saved to DB
5. WebSocketGateway.emitToUser() called
6. Socket event "notification" emitted
7. Frontend SocketProvider receives event
8. toast.success() displays
9. React Query invalidates and refetches

Nếu flow bị break ở bước nào, check logs ở bước đó.
