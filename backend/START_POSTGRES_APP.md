# How to Start PostgreSQL Server in Postgres.app

## Quick Start (3 Steps)

### Step 1: Stop Docker PostgreSQL (Required!)
Since Docker is currently using port 5432, you need to stop it first:

```bash
cd backend
docker-compose stop postgres
```

Or:
```bash
docker stop valuva_db
```

### Step 2: Start Postgres.app

**Method 1: Using GUI (Easiest)**
1. Open **Finder** → **Applications**
2. Double-click **Postgres.app**
3. In the Postgres.app window, click the **"Start"** button
4. Wait for the status indicator to turn **green** (showing "Running")

**Method 2: Using Terminal**
```bash
# Open Postgres.app
open -a Postgres.app

# Wait a few seconds, then verify it's running
sleep 3
psql postgresql://localhost:5432/postgres -c "SELECT version();"
```

### Step 3: Verify It's Running

Check the menu bar:
- Look for the **elephant icon** 🐘 in your macOS menu bar
- Click it to see status: should show "Running" with a green dot

Or check via terminal:
```bash
# Check if Postgres.app is running
ps aux | grep -i "Postgres.app" | grep -v grep

# Check if it's listening on port 5432
lsof -i :5432 | grep -i postgres
```

## Setting Up Your Database

Once Postgres.app is running, you need to create your database:

### Option A: Quick Setup Script

```bash
cd backend

# Connect and create database
psql postgresql://localhost:5432/postgres << EOF
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';
CREATE DATABASE valuva_db OWNER valuva_user;
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
\c valuva_db
GRANT ALL ON SCHEMA public TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO valuva_user;
EOF

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### Option B: Manual Setup

1. Open Terminal
2. Connect to PostgreSQL:
   ```bash
   psql postgresql://localhost:5432/postgres
   ```
   
3. Run these commands:
   ```sql
   CREATE USER valuva_user WITH PASSWORD 'valuva_pass';
   CREATE DATABASE valuva_db OWNER valuva_user;
   GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
   \c valuva_db
   GRANT ALL ON SCHEMA public TO valuva_user;
   \q
   ```

4. Run Prisma migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

## Common Issues & Solutions

### Issue: "Port 5432 already in use"
**Solution:** Docker is still running. Stop it first:
```bash
docker stop valuva_db
# OR
cd backend && docker-compose stop postgres
```

### Issue: "Connection refused"
**Solution:** Postgres.app might not be started. Check:
1. Open Postgres.app from Applications
2. Click the "Start" button
3. Wait for green status indicator

### Issue: "Password authentication failed"
**Solution:** Postgres.app might use your macOS username as default user. Try:
```bash
# Use your macOS username
psql -U $(whoami) -h localhost -d postgres

# Or create a user with password
psql postgresql://localhost:5432/postgres -c "CREATE USER postgres WITH PASSWORD 'postgres';"
```

## Daily Usage

### Start Postgres.app:
```bash
open -a Postgres.app
# Then click "Start" button in the GUI
```

### Stop Postgres.app:
- Click the elephant icon 🐘 in menu bar
- Click "Stop" button
- Or quit the app: `pkill -f Postgres.app`

### Check Status:
- Look at menu bar icon (green = running, red = stopped)
- Or: `psql postgresql://localhost:5432/postgres -c "SELECT 1;"`

## Auto-Start on Login

To make Postgres.app start automatically:

1. Open Postgres.app
2. Click **Postgres.app** in menu bar → **Preferences**
3. Check **"Start Postgres.app automatically"**
4. Check **"Start server automatically"**

## Switching Back to Docker

If you want to use Docker again:

```bash
# Stop Postgres.app
pkill -f Postgres.app

# Start Docker PostgreSQL
cd backend
docker-compose up -d postgres
```

## Quick Reference

| Action | Command |
|--------|---------|
| Start Postgres.app | `open -a Postgres.app` |
| Stop Postgres.app | `pkill -f Postgres.app` |
| Connect to database | `psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db` |
| Check if running | `lsof -i :5432 \| grep postgres` |
| Stop Docker first | `docker stop valuva_db` |

