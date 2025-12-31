# Using Postgres.app Instead of Docker

## Current Situation

You're currently using **Docker** for PostgreSQL (running on port 5432). If you want to use **Postgres.app** instead, you'll need to:

1. Stop the Docker PostgreSQL container
2. Start Postgres.app
3. Create/configure the database

## Option 1: Use Postgres.app (Recommended for Development)

### Step 1: Stop Docker PostgreSQL

```bash
cd backend
docker-compose stop postgres
# OR
docker stop valuva_db
```

### Step 2: Start Postgres.app

**Method A: Using GUI (Easiest)**

1. Open **Finder**
2. Go to **Applications**
3. Find **Postgres.app** and double-click it
4. Click the **Start** button in the Postgres.app window
5. Wait for the status to show "Running" (green dot)

**Method B: Using Command Line**

```bash
# Open Postgres.app
open -a Postgres.app

# Wait a few seconds for it to start, then verify
sleep 3
psql postgresql://localhost:5432/postgres -c "SELECT version();"
```

### Step 3: Create Database and User

Once Postgres.app is running, connect and create your database:

```bash
# Connect to default postgres database
psql postgresql://localhost:5432/postgres

# Or if you have a password set:
psql -U postgres -h localhost
```

Then run these SQL commands:

```sql
-- Create user (if it doesn't exist)
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';

-- Create database
CREATE DATABASE valuva_db OWNER valuva_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;

-- Connect to the new database
\c valuva_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO valuva_user;

-- Exit
\q
```

### Step 4: Update Environment Variables

Update your `backend/.env` file:

```env
DATABASE_URL=postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db?connection_limit=20&pool_timeout=20&connect_timeout=10
```

### Step 5: Run Migrations

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## Option 2: Keep Using Docker (Current Setup)

If you prefer to keep using Docker (which is already working):

```bash
# Start PostgreSQL in Docker
cd backend
docker-compose up -d postgres

# Check status
docker-compose ps postgres

# Connect
docker exec -it valuva_db psql -U valuva_user -d valuva_db
```

## Switching Between Docker and Postgres.app

### To Switch from Docker to Postgres.app:

1. **Stop Docker PostgreSQL:**

   ```bash
   cd backend
   docker-compose stop postgres
   ```

2. **Start Postgres.app:**
   - Open Postgres.app from Applications
   - Click "Start" button

3. **Verify port is free:**

   ```bash
   lsof -i :5432
   # Should show Postgres.app, not Docker
   ```

4. **Run migrations:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### To Switch from Postgres.app to Docker:

1. **Stop Postgres.app:**
   - Open Postgres.app
   - Click "Stop" button
   - Or quit the app: `pkill -f Postgres.app`

2. **Start Docker PostgreSQL:**

   ```bash
   cd backend
   docker-compose up -d postgres
   ```

3. **Verify:**
   ```bash
   docker-compose ps postgres
   ```

## Postgres.app Configuration

### Default Settings:

- **Port**: 5432
- **Host**: localhost
- **Default User**: Your macOS username (or `postgres`)
- **Data Directory**: `~/Library/Application Support/Postgres/var-XX` (where XX is version)

### Accessing Postgres.app Settings:

1. Click the **Postgres.app** icon in the menu bar
2. Select **Preferences**
3. Configure:
   - Port (default: 5432)
   - Data directory
   - PostgreSQL version
   - Auto-start on login

## Troubleshooting

### Port 5432 Already in Use

If you get "port already in use" error:

```bash
# Check what's using port 5432
lsof -i :5432

# If Docker is using it:
docker stop valuva_db

# If Postgres.app is using it:
# Stop it from the Postgres.app GUI or:
pkill -f Postgres.app
```

### Connection Refused

```bash
# Check if Postgres.app is running
ps aux | grep -i postgres.app

# Check if it's listening on port 5432
lsof -i :5432

# Try starting it again
open -a Postgres.app
```

### Permission Denied

If you get permission errors:

```bash
# Connect as your macOS user (default in Postgres.app)
psql postgresql://localhost:5432/postgres

# Or specify your macOS username
psql -U $(whoami) -h localhost -d postgres
```

## Quick Reference

### Postgres.app Commands:

```bash
# Start Postgres.app
open -a Postgres.app

# Connect to default database
psql postgresql://localhost:5432/postgres

# Connect to your database
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db

# Stop Postgres.app (from terminal)
pkill -f Postgres.app
```

### Docker Commands:

```bash
# Start
cd backend && docker-compose up -d postgres

# Stop
cd backend && docker-compose stop postgres

# Connect
docker exec -it valuva_db psql -U valuva_user -d valuva_db
```

## Recommendation

**For Development:** Postgres.app is simpler and faster to start/stop
**For Production/CI:** Docker is better for consistency and isolation

You can use either one - just make sure only one is running at a time on port 5432!
