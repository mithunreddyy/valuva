# Quick Fix: Database Permission Error

## Error: "User `valuva_user` was denied access on the database `valuva_db.public`"

This happens when running locally (`npm run dev`) because the database user doesn't have proper permissions.

## 🚀 Quick Fix (Choose One)

### Option 1: Run the Script (Easiest)

```bash
./scripts/fix-local-db-permissions.sh
```

This script will:
- Create the database if it doesn't exist
- Create the user if it doesn't exist
- Grant all necessary permissions
- Set up default privileges

### Option 2: Manual SQL Commands

Connect to PostgreSQL as superuser:

```bash
psql -U postgres
```

Then run:

```sql
-- Create database
CREATE DATABASE valuva_db;

-- Create user
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;

-- Connect to database
\c valuva_db;

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO valuva_user;
GRANT USAGE ON SCHEMA public TO valuva_user;

-- Grant privileges on existing objects
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO valuva_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO valuva_user;

-- Grant privileges on future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO valuva_user;
```

### Option 3: Use SQL File

```bash
psql -U postgres -f scripts/fix-local-db-permissions.sql
```

## ✅ After Fixing Permissions

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

## 🔍 Verify Permissions

Test the connection:

```bash
psql -U valuva_user -d valuva_db -c "SELECT 1;"
```

If this works, permissions are correct!

## 🐛 Troubleshooting

### Issue: "psql: error: connection to server failed"

**Solution:** Make sure PostgreSQL is running:
```bash
# macOS (Homebrew)
brew services start postgresql@15
# or
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check status
psql -U postgres -c "SELECT version();"
```

### Issue: "password authentication failed"

**Solution:** Try without password (local connections often don't need it):
```bash
psql -U postgres
# or
psql -U postgres -h localhost
```

### Issue: "role does not exist"

**Solution:** The user needs to be created. Run the fix script or SQL commands above.

### Issue: "database does not exist"

**Solution:** Create the database:
```sql
CREATE DATABASE valuva_db;
```

## 📝 Check Your DATABASE_URL

Make sure your `.env` file has:

```env
DATABASE_URL="postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db"
```

**Note:** For local development, you might not need a password if PostgreSQL is configured for peer authentication. In that case:

```env
DATABASE_URL="postgresql://valuva_user@localhost:5432/valuva_db"
```

## 🎯 One-Liner Fix

If you just want to quickly fix it:

```bash
psql -U postgres <<EOF
CREATE DATABASE valuva_db;
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
\c valuva_db;
GRANT ALL PRIVILEGES ON SCHEMA public TO valuva_user;
GRANT USAGE ON SCHEMA public TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO valuva_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO valuva_user;
EOF
```

Then:
```bash
npx prisma generate && npx prisma migrate dev && npm run dev
```


