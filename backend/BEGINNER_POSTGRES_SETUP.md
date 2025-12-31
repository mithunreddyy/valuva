# Complete Beginner's Guide: Setting Up PostgreSQL with Postgres.app

## 🎯 What We're Going to Do
1. Stop Docker PostgreSQL (if running)
2. Start Postgres.app
3. Create a database user with password
4. Create your database
5. Connect your app to the database
6. Test everything works

---

## Step 1: Stop Docker PostgreSQL (If Running)

Open Terminal and run:

```bash
cd /Users/mithunreddy/Documents/mithun/valuva/backend
docker-compose stop postgres
```

**What this does:** Stops the Docker PostgreSQL so Postgres.app can use port 5432.

---

## Step 2: Start Postgres.app

### Method 1: Using Finder (Easiest for Beginners)

1. **Open Finder** (click the Finder icon in your Dock)
2. Click **Applications** in the sidebar (or press `Cmd + Shift + A`)
3. Find **Postgres.app** in the list
4. **Double-click** Postgres.app to open it
5. You'll see a window with a big **"Start"** button
6. **Click the "Start" button**
7. Wait 5-10 seconds
8. You should see a **green dot** and "Running" status

### Method 2: Using Terminal

```bash
open -a Postgres.app
```

Then click "Start" in the Postgres.app window.

**✅ Check:** Look for the elephant icon 🐘 in your menu bar (top right). It should be green when running.

---

## Step 3: Create Database User and Database

Now we'll create a user and database for your app.

### Open Terminal and run these commands one by one:

```bash
# Step 3.1: Connect to PostgreSQL (this opens a database shell)
psql postgresql://localhost:5432/postgres
```

**What happens:** You'll see something like:
```
psql (15.x)
Type "help" for help.

postgres=#
```

The `postgres=#` is your prompt - you're now connected!

### Step 3.2: Create the User

In the `psql` prompt, type this command and press Enter:

```sql
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';
```

**What this does:** Creates a user named `valuva_user` with password `valuva_pass`

**Expected output:** `CREATE ROLE`

### Step 3.3: Create the Database

Still in the `psql` prompt, type:

```sql
CREATE DATABASE valuva_db OWNER valuva_user;
```

**What this does:** Creates a database named `valuva_db` owned by `valuva_user`

**Expected output:** `CREATE DATABASE`

### Step 3.4: Give User Permissions

Type these commands one by one:

```sql
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
```

```sql
\c valuva_db
```

**What `\c` does:** Connects to the `valuva_db` database

**Expected output:** `You are now connected to database "valuva_db" as user "postgres".`

Now type:

```sql
GRANT ALL ON SCHEMA public TO valuva_user;
```

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO valuva_user;
```

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO valuva_user;
```

### Step 3.5: Exit psql

Type:

```sql
\q
```

**What this does:** Exits the PostgreSQL shell and returns to Terminal

---

## Step 4: Update Your App's Configuration

### Step 4.1: Create/Update .env File

In Terminal, make sure you're in the backend folder:

```bash
cd /Users/mithunreddy/Documents/mithun/valuva/backend
```

Check if `.env` file exists:

```bash
ls -la .env
```

If it doesn't exist, create it:

```bash
touch .env
```

### Step 4.2: Add Database Connection String

Open the `.env` file in your text editor, or use Terminal:

```bash
# Open in default editor
open -a TextEdit .env

# OR use nano (Terminal editor)
nano .env
```

Add this line to the file:

```env
DATABASE_URL=postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db?connection_limit=20&pool_timeout=20&connect_timeout=10
```

**What this means:**
- `valuva_user` = your username
- `valuva_pass` = your password
- `localhost:5432` = server address and port
- `valuva_db` = your database name

**If using nano:** Press `Ctrl + X`, then `Y`, then `Enter` to save.

---

## Step 5: Run Database Migrations

Migrations create all the tables your app needs.

In Terminal:

```bash
cd /Users/mithunreddy/Documents/mithun/valuva/backend

# Generate Prisma Client (creates code to talk to database)
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate deploy
```

**What happens:**
- `prisma generate` creates TypeScript code to access your database
- `prisma migrate deploy` creates all tables (users, products, orders, etc.)

**Expected output:** You should see messages like:
```
✔ Generated Prisma Client
✔ Applied migration: 20250101000000_add_product_details_fields
✔ Applied migration: ...
```

---

## Step 6: Test the Connection

Let's verify everything works!

### Test 1: Connect via Terminal

```bash
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db -c "SELECT version();"
```

**Expected output:** You should see PostgreSQL version information.

### Test 2: List Tables

```bash
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db -c "\dt"
```

**Expected output:** You should see a list of tables like:
```
                 List of relations
 Schema |        Name        | Type  |    Owner    
--------+--------------------+-------+-------------
 public | users               | table | valuva_user
 public | products            | table | valuva_user
 public | orders              | table | valuva_user
 ...
```

### Test 3: Test from Your App

```bash
cd /Users/mithunreddy/Documents/mithun/valuva/backend

# Try to start your backend (this will test the connection)
npm run dev
```

If it starts without database errors, **you're all set!** ✅

---

## 🎉 Success Checklist

- [ ] Postgres.app is running (green dot in menu bar)
- [ ] User `valuva_user` created
- [ ] Database `valuva_db` created
- [ ] `.env` file has `DATABASE_URL`
- [ ] Migrations ran successfully
- [ ] Can connect via `psql`
- [ ] Tables are created
- [ ] App can start without errors

---

## 🆘 Troubleshooting

### Problem: "Port 5432 already in use"
**Solution:** Docker is still running
```bash
docker stop valuva_db
# OR
docker-compose stop postgres
```

### Problem: "Password authentication failed"
**Solution:** Check your password in `.env` matches what you created
```bash
# Recreate user with password
psql postgresql://localhost:5432/postgres
DROP USER IF EXISTS valuva_user;
CREATE USER valuva_user WITH PASSWORD 'valuva_pass';
\q
```

### Problem: "Database does not exist"
**Solution:** Create it again
```bash
psql postgresql://localhost:5432/postgres
CREATE DATABASE valuva_db OWNER valuva_user;
\q
```

### Problem: "Connection refused"
**Solution:** Postgres.app might not be started
1. Open Postgres.app
2. Click "Start" button
3. Wait for green status

### Problem: "Permission denied"
**Solution:** Grant permissions again
```bash
psql postgresql://localhost:5432/postgres
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
\c valuva_db
GRANT ALL ON SCHEMA public TO valuva_user;
\q
```

---

## 📚 Quick Reference Commands

```bash
# Start Postgres.app
open -a Postgres.app

# Connect to database
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db

# List all tables
psql postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db -c "\dt"

# Run migrations
cd backend && npx prisma migrate deploy

# Generate Prisma Client
cd backend && npx prisma generate
```

---

## 🎓 What You Learned

1. **Postgres.app** = Easy way to run PostgreSQL on Mac
2. **User** = Login account for database (like username)
3. **Database** = Container for your data (like a folder)
4. **Migrations** = Scripts that create tables
5. **Connection String** = How your app connects to database

You're now ready to use PostgreSQL with your app! 🚀

