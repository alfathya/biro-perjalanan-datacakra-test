# Biro Perjalanan API

API untuk sistem manajemen biro perjalanan yang memungkinkan pengelolaan destinasi, tourist, trip, dan payment.

## Teknologi yang Digunakan

- **Node.js** dengan **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM untuk database
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Validation

## Prerequisites

Pastikan Anda telah menginstall:
- Node.js (v16 atau lebih tinggi)
- MySQL
- npm atau yarn

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/alfathya/biro-perjalanan-datacakra-test.git
cd biro-perjalanan-datacakra-test
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Buat file `.env` berdasarkan `example.env`:
```bash
cp example.env .env
```

Isi file `.env` dengan konfigurasi yang sesuai:
```env
PORT=3000
DATABASE_URL="mysql://username:password@localhost:3306/biro_perjalanan"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database dengan data awal (opsional)
npm run seed
```

## Deployment

### Development
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`

### Production
```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/employee/register` - Registrasi employee (Admin only)
- `POST /api/auth/tourist/register` - Registrasi tourist
- `POST /api/auth/employee/tourist-register` - Registrasi tourist oleh employee
- `POST /api/auth/employee/tourist-approve/:id` - Approve tourist
- `POST /api/auth/login` - Login

### Destination Endpoints
- `GET /api/destination` - Get all destinations
- `GET /api/destination/detail/:id` - Get destination by ID
- `POST /api/destination` - Create destination (Admin only)
- `PUT /api/destination/:id` - Update destination (Admin only)
- `DELETE /api/destination/:id` - Delete destination (Admin only)

### Tourist Endpoints
- `GET /api/tourist/list` - Get all tourists (Employee only)
- `GET /api/tourist/detail/:id` - Get tourist detail (Employee only)
- `PATCH /api/tourist/:id` - Update tourist by employee (Employee only)
- `DELETE /api/tourist/:id` - Delete tourist (Employee only)
- `GET /api/tourist/profile` - Get own profile (Tourist only)
- `PATCH /api/tourist/profile` - Update own profile (Tourist only)

### Trip Endpoints
- `GET /api/trip/list` - Get all trips
- `GET /api/trip/detail/:id` - Get trip by ID
- `GET /api/trip/tourist/:touristId` - Get trips by tourist ID
- `POST /api/trip/create` - Create trip (Employee only)
- `PATCH /api/trip/:id` - Update trip
- `DELETE /api/trip/:id` - Delete trip
- `GET /api/trip/my-trips` - Get own trips (Tourist only)
- `POST /api/trip/book` - Create trip for self (Tourist only)
- `PUT /api/trip/rating/:id` - Update trip rating

### Payment Endpoints
- `GET /api/payment` - Get all payments (Employee only)
- `GET /api/payment/:id` - Get payment by ID
- `GET /api/payment/trip/:tripId` - Get payment by trip ID
- `POST /api/payment` - Create payment (Employee only)
- `PUT /api/payment/:id` - Update payment (Employee only)
- `PUT /api/payment/:id/confirm` - Confirm payment (Employee only)
- `DELETE /api/payment/:id` - Delete payment (Employee only)
- `GET /api/payments/my-payments` - Get own payments (Tourist only)
- `POST /api/payments/my-payment` - Create payment for own trip (Tourist only)
- `PATCH /api/payments/my-payment/:id/cancel` - Cancel payment (Tourist only)

## Authentication

API menggunakan JWT untuk authentication. Setelah login, sertakan token di header:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles

1. **Employee** - Dapat mengelola data ( tourists, trips, payments)
2. **Tourist** - Dapat mengelola profil sendiri, membuat trip, dan mengelola payment sendiri
3. **Admin** - Dapat mengelola semua data

## Database Schema

### User
- Menyimpan data user (employee & tourist)
- Role-based access control

### Tourist
- Profile lengkap tourist
- Membership level (bronze, silver, gold, platinum)
- Loyalty points dan statistik

### Destination
- Data destinasi wisata
- Informasi lokasi dan deskripsi

### Trip
- Data perjalanan
- Status trip (planned, confirmed, cancelled, completed)
- Rating dan review

### Payment
- Data pembayaran
- Multiple payment methods
- Status tracking

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port server | No (default: 3000) |
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret key untuk JWT | Yes |

## API Response Format

Semua response menggunakan format standar:
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

## Error Handling

Error response format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```
