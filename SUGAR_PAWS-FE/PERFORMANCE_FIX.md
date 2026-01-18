# Performance Fix Guide - Slow Navigation Issue

## Vấn đề

- Chuyển trang trong admin panel rất chậm (vài giây)
- ?\_rsc= requests trong Network tab mất nhiều thời gian
- Mỗi lần chuyển trang, React Query refetch tất cả data

## Giải pháp đã áp dụng

### 1. Tắt refetch không cần thiết

**File:** `src/const/config.ts`

```typescript
defaultOptions: {
  queries: {
    refetchOnMount: false,        // ✅ Không refetch khi mount
    refetchOnWindowFocus: false,  // ✅ Không refetch khi focus window
    staleTime: 1000 * 60 * 10,   // ✅ Data fresh trong 10 phút
    gcTime: 1000 * 60 * 15,      // ✅ Cache giữ 15 phút
  },
}
```

### 2. Cập nhật tất cả hooks queries

**Files đã sửa:**

- `src/hooks/queries/useUser.ts` - Added refetchOnMount: false, refetchOnWindowFocus: false
- `src/hooks/queries/useProducts.ts` - Added refetchOnMount: false, refetchOnWindowFocus: false
- `src/hooks/queries/useOrder.ts` - Added refetchOnMount: false, refetchOnWindowFocus: false

### 3. Tối ưu AdminNavbar

**File:** `src/components/admin/AdminNavbar.tsx`

- Đang dùng React.memo để prevent re-render
- Sử dụng startTransition cho navigation
- onClick với router.push thay vì Link

### 4. Đơn giản hóa Layout

**File:** `src/app/(root)/admin/layout.tsx`

- Removed PageCacheProvider (không cần thiết)
- Chỉ giữ "use client" và AdminProvider

### 5. Next.js Config

**File:** `next.config.ts`

- ppr: false - Tắt Partial Prerendering
- optimizePackageImports - Tối ưu imports

## Kiểm tra lại

### Bước 1: Restart dev server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Bước 2: Test navigation

1. Mở admin panel
2. Click vào các tabs: Products → Users → Orders → Revenue
3. Quan sát Network tab trong DevTools:
   - Xem request ?\_rsc= còn chậm không
   - Xem có refetch data không cần thiết không

### Bước 3: Check console

- Không có warning về re-render
- React Query không refetch data khi chuyển trang

## Nếu vẫn chậm

### Option 1: Tắt hoàn toàn RSC cho admin

Thêm vào mỗi page.tsx:

```typescript
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
```

### Option 2: Prefetch data

Trong AdminNavbar, prefetch data khi hover:

```typescript
const queryClient = useQueryClient();

const handleMouseEnter = (path: string) => {
  queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
};
```

### Option 3: Shallow routing

Thay router.push bằng:

```typescript
router.push(path, { scroll: false });
```

### Option 4: Check backend

Xem API response time:

```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:5000/api/products
```

## Expected Behavior

Sau khi apply fixes:

- Navigation nhanh < 500ms
- Không thấy loading spinner khi chuyển trang
- Network tab: requests hoàn thành nhanh
- React Query sử dụng cached data thay vì refetch

## Troubleshooting

### Vẫn thấy refetch?

Check query options trong component:

```typescript
useQuery({
  ...options,
  refetchOnMount: false, // ← Phải có dòng này
  refetchOnWindowFocus: false,
});
```

### ?\_rsc= requests vẫn chậm?

1. Check backend logs - API có chậm không?
2. Disable middleware - comment code trong src/middleware.ts
3. Try downgrade Next.js: `npm install next@14.2.0`
