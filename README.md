# Biro Perjalanan API

API untuk sistem manajemen biro perjalanan yang mengelola destinasi, wisatawan, perjalanan, dan pembayaran.

## Diagram
![ERD Diagram](https://drive.google.com/uc?export=view&id=1KUghNkYUiNk-mrDFOKTfaUQLj0IiBNZ_)


## Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL
- npm

### Installation
```bash
git clone https://github.com/alfathya/biro-perjalanan-datacakra-test.git
cd biro-perjalanan-datacakra-test
npm install
cp example.env .env
# Edit .env dengan konfigurasi database
npx prisma migrate deploy
npm run seed
npm run dev
```

### Base URL
- Production: `biro-perjalanan-datacakra-test-production.up.railway.app`
- Local: `http://localhost:3000`

## Authentication

Semua endpoint (kecuali register/login) memerlukan JWT token:
```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin**: Mengelola semua data sistem
- **Employee**: Mengelola data tourists, trips, dan payments
- **Tourist**: Mengelola profil sendiri dan melakukan booking

## API Endpoints

### Authentication
Mengelola registrasi, login, dan approval user.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/employee/register` | Registrasi employee baru (Admin only) |
| POST | `/api/auth/tourist/register` | Registrasi tourist baru |
| POST | `/api/auth/employee/tourist-register` | Employee mendaftarkan tourist |
| POST | `/api/auth/employee/tourist-approve/:id` | Approve registrasi tourist |
| POST | `/api/auth/login` | Login untuk semua role |

### Destinations
Mengelola data destinasi wisata.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destination` | Ambil semua destinasi |
| GET | `/api/destination/detail/:id` | Detail destinasi berdasarkan ID |
| POST | `/api/destination` | Tambah destinasi baru (Admin only) |
| PUT | `/api/destination/:id` | Update destinasi (Admin only) |
| DELETE | `/api/destination/:id` | Hapus destinasi (Admin only) |

### Tourists
Mengelola data dan profil tourist.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tourist/list` | Daftar semua tourist (Employee only) |
| GET | `/api/tourist/detail/:id` | Detail tourist (Employee only) |
| PATCH | `/api/tourist/:id` | Update data tourist (Employee only) |
| DELETE | `/api/tourist/:id` | Hapus tourist (Employee only) |
| GET | `/api/tourist/profile` | Profil sendiri (Tourist only) |
| PATCH | `/api/tourist/profile` | Update profil sendiri (Tourist only) |

### Trips
Mengelola data perjalanan dan booking.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trip/list` | Daftar semua trip |
| GET | `/api/trip/detail/:id` | Detail trip berdasarkan ID |
| GET | `/api/trip/tourist/:touristId` | Trip berdasarkan tourist ID |
| POST | `/api/trip/create` | Buat trip baru (Employee only) |
| PATCH | `/api/trip/:id` | Update trip (Employee only) |
| DELETE | `/api/trip/:id` | Hapus trip (Employee only) |
| GET | `/api/trip/my-trips` | Trip milik sendiri (Tourist only) |
| POST | `/api/trip/book` | Booking trip (Tourist only) |
| PUT | `/api/trip/rating/:id` | Beri rating trip (Tourist only) |

### Payments
Mengelola pembayaran dan transaksi.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment` | Daftar semua payment (Employee only) |
| GET | `/api/payment/:id` | Detail payment berdasarkan ID |
| GET | `/api/payment/trip/:tripId` | Payment berdasarkan trip ID |
| POST | `/api/payment` | Buat payment baru (Employee only) |
| PUT | `/api/payment/:id` | Update payment (Employee only) |
| PUT | `/api/payment/:id/confirm` | Konfirmasi payment (Employee only) |
| DELETE | `/api/payment/:id` | Hapus payment (Employee only) |
| GET | `/api/payments/my-payments` | Payment milik sendiri (Tourist only) |
| POST | `/api/payments/my-payment` | Buat payment sendiri (Tourist only) |
| PATCH | `/api/payments/my-payment/:id/cancel` | Cancel payment (Tourist only) |

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "pagination": {
    "current": 1,
    "pages": 10,
    "total": 100,
    "limit": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Environment Variables

```env
PORT=3000
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-secret-key"
```

## Testing

Import Postman collection: `mlaku-mulu test.postman_collection.json`

Set environment variables:
- `baseUrl`: Server URL (https://biro-perjalanan-datacakra-test-production.up.railway.app/)
- `adminToken`: Admin JWT token
- `employeeToken`: Employee JWT token  
- `touristToken`: Tourist JWT token

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Tech Stack
Node.js, TypeScript, Express.js, Prisma, MySQL, JWT
