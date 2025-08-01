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

## 📋 Prerequisites

Pastikan Anda telah menginstall:
- Node.js (v16 atau lebih tinggi)
- MySQL
- npm atau yarn

## 🛠️ Installation & Setup

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

## 🚀 Deployment

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

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/employee/register` - Registrasi employee
- `POST /api/auth/tourist/register` - Registrasi tourist
- `POST /api/auth/tourist/register-by-employee` - Registrasi tourist oleh employee
- `POST /api/auth/login` - Login
- `PUT /api/auth/approve-tourist/:id` - Approve tourist

### Destination Endpoints
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create destination (Employee only)
- `PUT /api/destinations/:id` - Update destination (Employee only)
- `DELETE /api/destinations/:id` - Delete destination (Employee only)

### Tourist Endpoints
- `GET /api/tourists` - Get all tourists (Employee only)
- `GET /api/tourists/:id` - Get tourist detail (Employee only)
- `GET /api/tourists/profile` - Get own profile (Tourist only)
- `PUT /api/tourists/profile` - Update own profile (Tourist only)
- `PUT /api/tourists/:id` - Update tourist by employee (Employee only)
- `DELETE /api/tourists/:id` - Delete tourist (Employee only)

### Trip Endpoints
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip by ID
- `GET /api/trips/my-trips` - Get own trips (Tourist only)
- `GET /api/trips/tourist/:touristId` - Get trips by tourist ID
- `POST /api/trips` - Create trip (Employee only)
- `POST /api/trips/create-for-tourist` - Create trip for self (Tourist only)
- `PUT /api/trips/:id` - Update trip
- `PUT /api/trips/:id/rating` - Update trip rating
- `DELETE /api/trips/:id` - Delete trip

### Payment Endpoints
- `GET /api/payments` - Get all payments (Employee only)
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/trip/:tripId` - Get payment by trip ID
- `GET /api/payments/my-payments` - Get own payments (Tourist only)
- `POST /api/payments` - Create payment (Employee only)
- `POST /api/payments/create-my-payment` - Create payment for own trip (Tourist only)
- `PUT /api/payments/:id` - Update payment (Employee only)
- `PUT /api/payments/:id/confirm` - Confirm payment (Employee only)
- `PUT /api/payments/:id/cancel` - Cancel payment (Tourist only)
- `DELETE /api/payments/:id` - Delete payment (Employee only)

## 🔐 Authentication

API menggunakan JWT untuk authentication. Setelah login, sertakan token di header:
```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

1. **Employee** - Dapat mengelola semua data (destinations, tourists, trips, payments)
2. **Tourist** - Dapat mengelola profil sendiri, membuat trip, dan mengelola payment sendiri

## 📊 Database Schema

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

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port server | No (default: 3000) |
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret key untuk JWT | Yes |

## 📝 API Response Format

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