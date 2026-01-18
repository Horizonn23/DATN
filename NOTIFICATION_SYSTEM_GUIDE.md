# 🔔 Hệ Thống Thông Báo Realtime - Hướng Dẫn

## Tổng Quan

Hệ thống thông báo realtime sử dụng Socket.IO để thông báo cho user khi admin thay đổi trạng thái đơn hàng.

## Backend (NestJS)

### 1. Database Schema

**Bảng Notification** (`prisma/schema.prisma`):

```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  userId    Int
  orderId   Int?
  title     String   @db.VarChar(200)
  message   String   @db.Text
  type      String   @default("ORDER_STATUS") @db.VarChar(50)
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  order Order? @relation(fields: [orderId], references: [id], onDelete: SetNull)
}
```

### 2. WebSocket Gateway

**File:** `src/modules/websocket/websocket.gateway.ts`

- Lắng nghe kết nối từ client
- Quản lý mapping userId <-> socketId
- Emit event "notification" đến specific user

**Cách hoạt động:**

1. Client connect và gửi event "register" với userId
2. Gateway lưu mapping userId -> socketId
3. Khi có notification mới, emit đến socketId của user

### 3. Notification Service

**File:** `src/modules/notification/notification.service.ts`

**Methods:**

- `createNotification()` - Tạo notification và emit realtime qua socket
- `getUserNotifications()` - Lấy danh sách notifications
- `getUnreadCount()` - Đếm số notification chưa đọc
- `markAsRead()` - Đánh dấu đã đọc
- `markAllAsRead()` - Đánh dấu tất cả đã đọc
- `deleteNotification()` - Xóa notification
- `deleteAllNotifications()` - Xóa tất cả

### 4. Order Service Integration

**File:** `src/modules/order/order.service.ts`

Khi admin update order status, tự động:

1. Cập nhật order trong database
2. Tạo notification cho user
3. Emit socket event realtime

**Status Messages:**

- CONFIRMED: "Đơn hàng của bạn đã được xác nhận"
- DELIVERED: "Đơn hàng của bạn đang được giao"
- COMPLETED: "Đơn hàng của bạn đã hoàn thành"
- CANCELLED: "Đơn hàng của bạn đã bị hủy"
- REQUESTCANCEL: "Yêu cầu hủy đơn hàng đang được xử lý"
- REFUNDED: "Đơn hàng của bạn đã được hoàn tiền"

### 5. API Endpoints

```
GET    /notifications              - Lấy danh sách (query: limit)
GET    /notifications/unread-count - Đếm số chưa đọc
PATCH  /notifications/:id/read     - Đánh dấu 1 notification đã đọc
PATCH  /notifications/read-all     - Đánh dấu tất cả đã đọc
DELETE /notifications/:id          - Xóa 1 notification
DELETE /notifications              - Xóa tất cả
```

## Frontend (Next.js)

### 1. Socket Provider

**File:** `src/provider/SocketProvider.tsx`

**Features:**

- Auto connect khi user login (lấy userId từ localStorage)
- Auto register với server
- Listen event "notification"
- Show toast notification khi nhận message mới
- Auto invalidate React Query để refresh UI

### 2. Notification Icon Component

**File:** `src/components/ui/NotificationIcon.tsx`

**Features:**

- ✅ Badge đỏ hiển thị số notification chưa đọc
- ✅ Dropdown panel với danh sách notifications
- ✅ Đánh dấu đã đọc (từng cái hoặc tất cả)
- ✅ Xóa notification
- ✅ Hiển thị thời gian relative (vd: "5 phút trước")
- ✅ Color coding theo trạng thái đơn hàng
- ✅ Green dot indicator khi socket connected

### 3. React Query Hooks

**File:** `src/hooks/queries/useNotification.ts`

```typescript
useGetNotifications(limit); // Lấy danh sách
useGetUnreadCount(); // Đếm chưa đọc
useMarkAsRead(); // Đánh dấu 1 đã đọc
useMarkAllAsRead(); // Đánh dấu tất cả
useDeleteNotification(); // Xóa 1
useDeleteAllNotifications(); // Xóa tất cả
```

### 4. Integration với Header

**File:** `src/components/Header.tsx`

```tsx
{
  userInfo && userInfo.username && <NotificationIcon />;
}
```

Icon chỉ hiển thị khi user đã login.

## Cách Sử Dụng

### Test Flow:

1. **Khởi động Backend:**

   ```bash
   cd SUGAR_PAWS_BE
   npm run start:dev
   ```

2. **Khởi động Frontend:**

   ```bash
   cd SUGAR_PAWS-FE
   npm run dev
   ```

3. **Đăng nhập với user account** (không phải admin)

4. **Tạo đơn hàng:**
   - Thêm sản phẩm vào giỏ
   - Checkout và tạo order

5. **Đăng nhập admin panel** (tab khác hoặc incognito):
   - Truy cập `/admin/orders`
   - Tìm order vừa tạo
   - Thay đổi status: PENDING → CONFIRMED

6. **Kiểm tra user tab:**
   - ✅ Toast notification xuất hiện ngay lập tức
   - ✅ Badge đỏ trên bell icon tăng lên
   - ✅ Click bell icon → xem notification mới

### Debugging:

**Backend logs:**

```
✅ Socket connected: <socketId>
🔔 User <userId> registered with socket <socketId>
🔔 Emitted notification to user <userId>
```

**Frontend console:**

```
✅ Socket connected: <socketId>
🔔 New notification: {...}
```

**Network tab:**

- WebSocket connection: `ws://localhost:5000/socket.io/`
- Polling fallback nếu WebSocket failed

## Environment Variables

### Backend (.env):

```env
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Socket không connect:

1. Check backend running: `http://localhost:5000`
2. Check CORS config trong websocket.gateway.ts
3. Check user đã login chưa (localStorage có "user")

### Không nhận notification:

1. Xem backend logs - có emit không?
2. Xem frontend console - socket connected?
3. Check userId trong register event
4. Verify notification được tạo trong database

### Badge không update:

1. Check React Query invalidation
2. Xem Network tab - API /notifications/unread-count được gọi không?
3. Clear browser cache

## Customization

### Thay đổi notification messages:

Edit `src/modules/order/order.service.ts`:

```typescript
const statusMessages = {
  CONFIRMED: "Your custom message",
  // ...
};
```

### Thêm notification types khác:

1. Tạo method mới trong NotificationService
2. Gọi `createNotification()` với type khác
3. Cập nhật UI để handle type mới

### Styling notification icon:

Edit `src/components/ui/NotificationIcon.tsx` - dùng Tailwind classes

## Performance Notes

- Socket reconnection: auto retry 5 lần
- Notification cache: 5 phút (staleTime)
- Unread count cache: 30 giây
- Max notifications displayed: 20 (configurable)

## Security

- ✅ JWT authentication required cho API endpoints
- ✅ Notification chỉ visible cho owner (userId check)
- ✅ Socket register event validate userId
- ✅ XSS protection với React escaping

## Future Enhancements

- [ ] Notification preferences (email, push, in-app)
- [ ] Mark as read on scroll/view
- [ ] Notification categories/filters
- [ ] Sound notification
- [ ] Desktop push notifications
- [ ] Notification history page (full page view)
