# Payment API Documentation

## Overview
API Payment untuk mengelola pembayaran trip dalam sistem biro perjalanan. Payment terhubung dengan Trip dan memiliki status pembayaran yang dapat dikelola.

## Authentication
Semua endpoint memerlukan JWT token dalam header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Admin/Employee Endpoints

#### GET /api/payment
**Deskripsi**: Mendapatkan semua payments dengan pagination (hanya untuk admin/employee)

**Query Parameters**:
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Data payments berhasil diambil",
  "data": [
    {
      "id": "payment-uuid",
      "tripId": "trip-uuid",
      "amount": 5000000,
      "method": "bank_transfer",
      "status": "paid",
      "transactionId": "TXN123456789",
      "paymentDate": "2024-01-15T10:30:00.000Z",
      "notes": "Pembayaran lunas",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "trip": {
        "id": "trip-uuid",
        "tanggalMulaiPerjalanan": "2024-02-01T00:00:00.000Z",
        "tanggalBerakhirPerjalanan": "2024-02-07T00:00:00.000Z",
        "participants": 2,
        "totalPrice": 5000000,
        "status": "confirmed",
        "tourist": {
          "id": "tourist-uuid",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "destination": {
          "id": "destination-uuid",
          "name": "Bali",
          "country": "Indonesia",
          "city": "Denpasar"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET /api/payment/:id
**Deskripsi**: Mendapatkan payment berdasarkan ID (hanya untuk admin/employee)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Data payment berhasil diambil",
  "data": {
    "id": "payment-uuid",
    "tripId": "trip-uuid",
    "amount": 5000000,
    "method": "bank_transfer",
    "status": "paid",
    "transactionId": "TXN123456789",
    "paymentDate": "2024-01-15T10:30:00.000Z",
    "notes": "Pembayaran lunas",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "trip": {
      // ... trip details
    }
  }
}
```

#### POST /api/payment
**Deskripsi**: Membuat payment baru (hanya untuk admin/employee)

**Request Body**:
```json
{
  "tripId": "trip-uuid",
  "amount": 5000000,
  "method": "bank_transfer",
  "transactionId": "TXN123456789",
  "notes": "Pembayaran via transfer bank"
}
```

**Validation Rules**:
- `tripId`: Required, harus UUID valid
- `amount`: Required, harus angka >= 0
- `method`: Required, enum: ['cash', 'bank_transfer', 'credit_card', 'digital_wallet']
- `transactionId`: Optional, string
- `notes`: Optional, string

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Payment berhasil dibuat",
  "data": {
    "id": "payment-uuid",
    "tripId": "trip-uuid",
    "amount": 5000000,
    "method": "bank_transfer",
    "status": "pending",
    "transactionId": "TXN123456789",
    "paymentDate": null,
    "notes": "Pembayaran via transfer bank",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z",
    "trip": {
      // ... trip details
    }
  }
}
```

#### PUT /api/payment/:id
**Deskripsi**: Update payment (hanya untuk admin/employee)

**Request Body**:
```json
{
  "status": "paid",
  "transactionId": "TXN987654321",
  "paymentDate": "2024-01-15T10:30:00.000Z",
  "notes": "Pembayaran dikonfirmasi"
}
```

**Validation Rules**:
- `status`: Optional, enum: ['pending', 'paid', 'refunded']
- `transactionId`: Optional, string
- `paymentDate`: Optional, date
- `notes`: Optional, string

#### PATCH /api/payment/:id/confirm
**Deskripsi**: Konfirmasi pembayaran (hanya untuk admin/employee)

**Request Body**:
```json
{
  "transactionId": "TXN987654321"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Payment berhasil dikonfirmasi",
  "data": {
    "id": "payment-uuid",
    "status": "paid",
    "paymentDate": "2024-01-15T10:30:00.000Z",
    // ... other payment details
  }
}
```

#### DELETE /api/payment/:id
**Deskripsi**: Hapus payment (hanya untuk admin/employee)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Payment berhasil dihapus"
}
```

### 2. Tourist Endpoints

#### GET /api/payment/my-payments
**Deskripsi**: Mendapatkan payments milik tourist yang sedang login

**Query Parameters**:
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Data payments berhasil diambil",
  "data": [
    {
      "id": "payment-uuid",
      "tripId": "trip-uuid",
      "amount": 3000000,
      "method": "digital_wallet",
      "status": "pending",
      "transactionId": null,
      "paymentDate": null,
      "notes": "Menunggu konfirmasi",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z",
      "trip": {
        // ... trip details
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST /api/payment/my-payment
**Deskripsi**: Membuat payment untuk trip milik tourist yang sedang login

**Request Body**:
```json
{
  "tripId": "trip-uuid",
  "amount": 3000000,
  "method": "digital_wallet",
  "transactionId": "GOPAY123456",
  "notes": "Pembayaran via GoPay"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Payment berhasil dibuat",
  "data": {
    "id": "payment-uuid",
    "tripId": "trip-uuid",
    "amount": 3000000,
    "method": "digital_wallet",
    "status": "pending",
    "transactionId": "GOPAY123456",
    "paymentDate": null,
    "notes": "Pembayaran via GoPay",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z",
    "trip": {
      // ... trip details
    }
  }
}
```

### 3. Shared Endpoints

#### GET /api/payment/trip/:tripId
**Deskripsi**: Mendapatkan payment berdasarkan trip ID (bisa diakses employee dan tourist)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Data payment berhasil diambil",
  "data": {
    "id": "payment-uuid",
    "tripId": "trip-uuid",
    "amount": 5000000,
    "method": "bank_transfer",
    "status": "paid",
    // ... other payment details
  }
}
```

**Response Not Found (404)**:
```json
{
  "success": false,
  "message": "Payment untuk trip ini tidak ditemukan"
}
```

## Payment Methods
- `cash`: Pembayaran tunai
- `bank_transfer`: Transfer bank
- `credit_card`: Kartu kredit
- `digital_wallet`: Dompet digital (GoPay, OVO, Dana, dll)

## Payment Status
- `pending`: Menunggu konfirmasi
- `paid`: Sudah dibayar/dikonfirmasi
- `refunded`: Dikembalikan/refund

## Error Responses

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Trip ini sudah memiliki payment"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Token tidak valid"
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk membuat payment untuk trip ini"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Payment tidak ditemukan"
}
```

**422 Validation Error**:
```json
{
  "success": false,
  "message": "Payment method harus salah satu dari: cash, bank_transfer, credit_card, digital_wallet"
}
```

## Business Rules

1. **Satu Trip Satu Payment**: Setiap trip hanya bisa memiliki satu payment
2. **Tourist Access Control**: Tourist hanya bisa membuat payment untuk trip milik mereka sendiri
3. **Auto Trip Confirmation**: Ketika payment dikonfirmasi (status = paid), status trip otomatis berubah menjadi 'confirmed'
4. **Payment Validation**: Amount harus >= 0, method harus sesuai enum yang tersedia
5. **Status Progression**: Payment biasanya dimulai dari 'pending' → 'paid' atau 'refunded'

## Usage Examples

### Contoh Flow Tourist:
1. Tourist login dan mendapat JWT token
2. Tourist membuat trip via `/api/trips/book`
3. Tourist membuat payment via `POST /api/payment/my-payment`
4. Tourist cek status payment via `GET /api/payment/my-payments`
5. Admin konfirmasi payment via `PATCH /api/payment/:id/confirm`
6. Trip status otomatis berubah menjadi 'confirmed'

### Contoh Flow Admin:
1. Admin login dan mendapat JWT token
2. Admin lihat semua payments via `GET /api/payment`
3. Admin konfirmasi payment via `PATCH /api/payment/:id/confirm`
4. Admin bisa update/delete payment jika diperlukan