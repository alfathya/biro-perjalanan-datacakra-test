# Trip API Documentation

API untuk mengelola perjalanan wisata (Trip) dalam sistem biro perjalanan.

## Endpoints

### 1. Employee/Admin Endpoints

#### GET /trip/list
Mendapatkan daftar semua trip (hanya untuk Employee/Admin)

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter berdasarkan status (`planned`, `confirmed`, `cancelled`)
- `touristId` (optional): Filter berdasarkan ID tourist

**Response:**
```json
{
  "success": true,
  "message": "Daftar trip berhasil diambil",
  "data": [...],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "limit": 10
  }
}
```

#### GET /trip/detail/:id
Mendapatkan detail trip berdasarkan ID (hanya untuk Employee/Admin)

**Response:**
```json
{
  "success": true,
  "message": "Detail trip berhasil diambil",
  "data": {
    "id": "uuid",
    "touristId": "uuid",
    "destinationId": "uuid",
    "tanggalMulaiPerjalanan": "2024-01-15T00:00:00.000Z",
    "tanggalBerakhirPerjalanan": "2024-01-20T00:00:00.000Z",
    "participants": 2,
    "totalPrice": 5000000,
    "status": "planned",
    "tourist": {...},
    "destination": {...},
    "payment": {...}
  }
}
```

#### POST /trip/create
Membuat trip baru (hanya untuk Employee/Admin)

**Request Body:**
```json
{
  "touristId": "uuid",
  "destinationId": "uuid",
  "tanggalMulaiPerjalanan": "2024-01-15",
  "tanggalBerakhirPerjalanan": "2024-01-20",
  "participants": 2,
  "totalPrice": 5000000,
  "notes": "Catatan khusus",
  "specialRequests": "Permintaan khusus",
  "status": "planned"
}
```

#### PATCH /trip/:id
Memperbarui trip (hanya untuk Employee/Admin)

**Request Body:**
```json
{
  "destinationId": "uuid",
  "tanggalMulaiPerjalanan": "2024-01-16",
  "participants": 3,
  "totalPrice": 7500000,
  "status": "confirmed"
}
```

#### DELETE /trip/:id
Menghapus trip (hanya untuk Employee/Admin)

**Response:**
```json
{
  "success": true,
  "message": "Trip berhasil dihapus"
}
```

#### GET /trip/tourist/:touristId
Mendapatkan daftar trip berdasarkan tourist ID (hanya untuk Employee/Admin)

### 2. Tourist Endpoints

#### GET /trip/my-trips
Mendapatkan daftar trip milik tourist yang sedang login

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `status` (optional): Filter berdasarkan status

#### POST /trip/book
Membuat booking trip baru untuk tourist yang sedang login

**Request Body:**
```json
{
  "destinationId": "uuid",
  "tanggalMulaiPerjalanan": "2024-01-15",
  "tanggalBerakhirPerjalanan": "2024-01-20",
  "participants": 2,
  "totalPrice": 5000000,
  "notes": "Catatan khusus",
  "specialRequests": "Permintaan khusus"
}
```

#### PATCH /trip/rating/:id
Memberikan rating dan review untuk trip

**Request Body:**
```json
{
  "rating": 5,
  "review": "Perjalanan yang sangat menyenangkan!"
}
```

### 3. Shared Endpoints

#### GET /trip/:id
Mendapatkan detail trip berdasarkan ID (dapat diakses oleh Tourist dan Employee)

## Status Trip

- `planned`: Trip yang sudah direncanakan
- `confirmed`: Trip yang sudah dikonfirmasi
- `cancelled`: Trip yang dibatalkan

## Validasi

### Create Trip
- `touristId`: Harus berupa UUID yang valid
- `destinationId`: Harus berupa UUID yang valid
- `tanggalMulaiPerjalanan`: Harus berupa tanggal yang valid
- `tanggalBerakhirPerjalanan`: Harus berupa tanggal yang valid dan setelah tanggal mulai
- `participants`: Minimal 1 orang
- `totalPrice`: Tidak boleh negatif

### Update Trip
- Semua field bersifat optional
- Validasi yang sama dengan create trip untuk field yang diisi
- `rating`: Harus antara 1-5 (hanya untuk endpoint rating)

## Error Responses

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Authentication

Semua endpoint memerlukan authentication token dalam header:
```
Authorization: Bearer <token>
```

## Authorization

- **Employee/Admin**: Dapat mengakses semua endpoint
- **Tourist**: Hanya dapat mengakses endpoint yang diizinkan dan data milik mereka sendiri