# 🎯 CHEAT SHEET - Revenue Prediction API

## ⚡ Quick Reference

**Base URL**: `http://localhost:5080/api`

**Port**: `5080` (không phải 3000!)

**API Prefix**: `/api` (bắt buộc!)

---

## 🔑 1. Login (Lấy Token)

```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

---

## 🤖 2. Train Model

```bash
curl -X POST http://localhost:5080/api/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain":12}'
```

---

## 🔮 3. Predict (1 tháng)

```bash
curl http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 4. Predict (6 tháng)

```bash
curl http://localhost:5080/api/revenue-prediction/predict-next-months?months=6 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📈 5. Historical Data

```bash
curl http://localhost:5080/api/revenue-prediction/historical-data?months=12 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ℹ️ 6. Model Info

```bash
curl http://localhost:5080/api/revenue-prediction/model-info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🌐 Swagger UI

Truy cập: **http://localhost:5080/api/docs**

1. Click "Authorize"
2. Nhập: `Bearer YOUR_TOKEN`
3. Test ngay!

---

## 🚀 Demo Script

```bash
node demo-revenue-prediction.js YOUR_TOKEN
```

---

## 💡 PowerShell (Windows)

### Login

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5080/api/auth/login" `
  -Method Post `
  -Body (@{email="admin@example.com";password="your-password"} | ConvertTo-Json) `
  -ContentType "application/json"

$token = $response.access_token
```

### Train

```powershell
Invoke-RestMethod -Uri "http://localhost:5080/api/revenue-prediction/train" `
  -Method Post `
  -Headers @{Authorization="Bearer $token"} `
  -Body (@{monthsToTrain=12} | ConvertTo-Json) `
  -ContentType "application/json"
```

### Predict

```powershell
Invoke-RestMethod -Uri "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" `
  -Headers @{Authorization="Bearer $token"}
```

---

## ⚠️ Common Mistakes

| ❌ Wrong              | ✅ Correct                |
| --------------------- | ------------------------- |
| `localhost:3000`      | `localhost:5080`          |
| `/revenue-prediction` | `/api/revenue-prediction` |
| `YOUR_TOKEN`          | `Bearer YOUR_TOKEN`       |

---

## 🎓 Full Workflow

```bash
# 1. Seed data
npm run seed:orders

# 2. Start server
npm run dev

# 3. Login (get token)
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pass"}'

# 4. Train model
curl -X POST http://localhost:5080/api/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain":12}'

# 5. Get predictions
curl http://localhost:5080/api/revenue-prediction/predict-next-months?months=6 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Docs

- Full API Docs: `API_CONFIGURATION.md`
- Module README: `src/modules/revenue-prediction/README.md`
- Examples: `REVENUE_PREDICTION_EXAMPLES.md`
- Seeder Guide: `prisma/seed/ORDER_SEEDER_GUIDE.md`
