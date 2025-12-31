# PostgreSQL Management Commands

## Current Setup

- **Container Name**: `valuva_db`
- **Port**: `5432`
- **Database**: `valuva_db`
- **User**: `valuva_user`
- **Password**: `valuva_pass`

## Quick Start/Stop Commands

### Start PostgreSQL

```bash
cd backend
docker-compose up -d postgres
```

### Stop PostgreSQL

```bash
cd backend
docker-compose stop postgres
# OR to remove container:
docker-compose down postgres
```

### Restart PostgreSQL

```bash
cd backend
docker-compose restart postgres
```

### Check Status

```bash
cd backend
docker-compose ps
# OR
docker ps | grep valuva_db
```

## Connect to PostgreSQL

### Using Docker (Recommended)

```bash
# Interactive PostgreSQL shell
docker exec -it valuva_db psql -U valuva_user -d valuva_db

# Run a single command
docker exec -it valuva_db psql -U valuva_user -d valuva_db -c "SELECT version();"
```

### Using psql (if installed locally)

```bash
# Connect using connection string
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db

# OR with environment variables
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=valuva_db
export PGUSER=valuva_user
export PGPASSWORD=valuva_pass
psql
```

## Common Database Operations

### View All Databases

```bash
docker exec -it valuva_db psql -U valuva_user -d valuva_db -c "\l"
```

### View All Tables

```bash
docker exec -it valuva_db psql -U valuva_user -d valuva_db -c "\dt"
```

### View Table Schema

```bash
docker exec -it valuva_db psql -U valuva_user -d valuva_db -c "\d table_name"
```

### Run Prisma Migrations

```bash
cd backend
npx prisma migrate deploy
```

### Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### View Prisma Studio (Database GUI)

```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

## Troubleshooting

### Check if PostgreSQL is Running

```bash
docker ps | grep valuva_db
# Should show container as "Up" and "healthy"
```

### Check Port 5432

```bash
lsof -i :5432
# Should show Docker process using the port
```

### View PostgreSQL Logs

```bash
cd backend
docker-compose logs postgres
# OR follow logs in real-time:
docker-compose logs -f postgres
```

### Reset Database (⚠️ DESTRUCTIVE)

```bash
# Stop and remove container + volume
cd backend
docker-compose down -v postgres

# Start fresh
docker-compose up -d postgres

# Wait for it to be healthy, then run migrations
npx prisma migrate deploy
```

### Backup Database

```bash
docker exec -t valuva_db pg_dump -U valuva_user valuva_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
cat backup_file.sql | docker exec -i valuva_db psql -U valuva_user -d valuva_db
```

## Connection String Format

```
postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db?connection_limit=20&pool_timeout=20&connect_timeout=10
```

## Environment Variables

Make sure your `.env` file has:

```env
DATABASE_URL=postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db?connection_limit=20&pool_timeout=20&connect_timeout=10
```
