# E-KOS - Sistem Manajemen Kos

Aplikasi manajemen kos yang dibangun dengan Next.js, PostgreSQL, dan Drizzle ORM.

## 🚀 Quick Start dengan Docker

### Prasyarat
- Docker dan Docker Compose terinstal
- Node.js 20+ (untuk development)

### Cara Menjalankan

#### 1. **Development Mode (Tanpa Docker)**

```bash
# Install dependencies
npm install

# Jalankan PostgreSQL dengan Docker
docker-compose up postgres -d

# Setup database (migration)
npm run db:push

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di:
- Next.js: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`

---

#### 2. **Production Mode (Dengan Docker - Full Stack)**

```bash
# Build dan jalankan semua container
npm run docker:build
npm run docker:up

# Atau dengan satu command
docker-compose up --build -d
```

Aplikasi akan berjalan di:
- Next.js: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`

**Perintah Docker lainnya:**
```bash
# Lihat logs
npm run docker:logs

# Stop semua container
npm run docker:down

# Stop dan hapus volumes (hapus data database)
docker-compose down -v
```

---

## 🗄️ Database Configuration

### Connection Strings

**Development (Local):**
```
DATABASE_URL=postgresql://ekos_user:ekos_password@localhost:5432/ekos_db
```

**Production (Docker Container):**
```
DATABASE_URL=postgresql://ekos_user:ekos_password@postgres:5432/ekos_db
```

### Drizzle Commands

```bash
# Generate migration files
npm run db:generate

# Push schema to database (tanpa migration files)
npm run db:push

# Run migrations
npm run db:migrate

# Open Drizzle Studio (Database GUI)
npm run db:studio
```

---

## 📁 Struktur Project

```
e-kos/
├── src/
│   ├── db/
│   │   └── schema.ts          # Database schema
│   ├── pages/                 # Next.js pages
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── services/              # Business logic
├── drizzle/                   # Migration files
├── public/                    # Static assets
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Docker build instructions
├── docker-entrypoint.sh       # Container startup script
├── drizzle.config.ts          # Drizzle configuration
└── .env                       # Environment variables
```

---

## 🔧 Environment Variables

Copy file `.env.example` ke `.env` dan sesuaikan:

```bash
cp env.example .env
```

### Required Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret key untuk NextAuth

### Optional Variables:
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth
- `EMAIL_SERVER_*` - Email configuration
- `MIDTRANS_*` - Payment gateway

---

## 🐳 Docker Architecture

```
┌──────────────────────────────────────────────────────────┐
│            Docker Network (ekos-network)                 │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │              │    │              │    │          │  │
│  │  PostgreSQL  │◄───┤   Next.js    │    │ pgAdmin  │  │
│  │  Container   │    │   Container  │    │  (GUI)   │  │
│  │              │    │              │    │          │  │
│  │  Port: 5432  │    │  Port: 3000  │    │Port: 5050│  │
│  └──────┬───────┘    └──────────────┘    └────┬─────┘  │
│         │                    │                 │        │
└─────────┼────────────────────┼─────────────────┼────────┘
          │                    │                 │
          ▼                    ▼                 ▼
    postgres_data         localhost:3000   localhost:5050
```

---
## 🔌 Menggunakan pgAdmin

### Akses pgAdmin
1. Buka browser: `http://localhost:5050`
2. Login dengan:
   - **Email:** `admin@ekos.com`
   - **Password:** `admin123`

### Menambahkan Server PostgreSQL
1. Klik kanan **Servers** → **Register** → **Server**
2. Tab **General:**
   - Name: `E-KOS Database`
3. Tab **Connection:**
   - Host: `postgres` (nama service di docker-compose)
   - Port: `5432`
   - Username: `ekos_user`
   - Password: `ekos_password`
   - Database: `ekos_db`
4. Klik **Save**

Sekarang Anda bisa manage database secara visual! 🎉

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema ke database |
| `npm run db:generate` | Generate migrations |
| `npm run db:studio` | Buka Drizzle Studio |
| `npm run docker:build` | Build Docker images |
| `npm run docker:up` | Start containers |
| `npm run docker:down` | Stop containers |
| `npm run docker:logs` | View logs |

---

## 🔍 Troubleshooting

### Database Connection Error

**Problem:** Cannot connect to database
```
Error: getaddrinfo ENOTFOUND postgres
```

**Solution:**
- Pastikan PostgreSQL container sudah running: `docker-compose ps`
- Cek DATABASE_URL menggunakan host yang benar:
  - Development (local): `localhost:5432`
  - Production (Docker): `postgres:5432`

### Migration Error

**Problem:** Migration failed
```
Error: relation "users" already exists
```

**Solution:**
```bash
# Reset database (WARNING: menghapus semua data)
docker-compose down -v
docker-compose up postgres -d
npm run db:push
```

### Port Already in Use

**Problem:** Port 3000 or 5432 sudah digunakan

**Solution:**
```bash
# Cek process yang menggunakan port
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Stop container yang conflict
docker-compose down

# Atau ubah port di docker-compose.yml
# "3001:3000" untuk Next.js
# "5433:5432" untuk PostgreSQL
```

---

## 📚 Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js
- **Styling:** TailwindCSS
- **Container:** Docker & Docker Compose

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
