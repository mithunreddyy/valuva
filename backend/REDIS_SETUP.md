# Redis Setup Guide

## Current Status
Redis is **optional** for your application. The app will work without it, but some features will be disabled:
- Caching (will use in-memory fallback)
- Background job queues (email, stock alerts)
- Rate limiting (will use in-memory fallback)

## Option 1: Install and Run Redis (Recommended for Production)

### Install Redis using Homebrew

```bash
# Install Redis
brew install redis

# Start Redis (runs in background)
brew services start redis

# OR start Redis manually (foreground)
redis-server
```

### Verify Redis is Running

```bash
# Test connection
redis-cli ping
# Should return: PONG

# Check if running
brew services list | grep redis
# OR
lsof -i :6379
```

### Update .env (Already Configured)

Your `.env` already has:
```env
REDIS_URL=redis://localhost:6379
```

That's all you need! The app will automatically connect.

---

## Option 2: Disable Redis (For Development)

If you don't want to use Redis, comment out or remove the Redis URL:

```bash
cd backend

# Comment out Redis URL
sed -i '' 's/^REDIS_URL=/#REDIS_URL=/' .env

# OR remove it entirely
# Just delete or comment the REDIS_URL line in .env
```

The app will log:
```
Redis not configured. Caching and background jobs will be disabled.
```

---

## Option 3: Use Docker Redis (Alternative)

If you prefer Docker:

```bash
# Add to docker-compose.yml or run standalone
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine

# Verify
docker ps | grep redis
```

---

## Troubleshooting

### "Redis connection error" messages

**Solution:** The app is trying to connect but Redis isn't running.

1. **Install and start Redis:**
   ```bash
   brew install redis
   brew services start redis
   ```

2. **OR disable Redis:**
   - Comment out `REDIS_URL` in `.env`
   - Restart your server

### Redis keeps disconnecting

**Check Redis logs:**
```bash
# If using Homebrew
brew services info redis

# Check Redis directly
redis-cli info server
```

### Port 6379 already in use

**Find what's using it:**
```bash
lsof -i :6379
```

**Kill the process or use a different port:**
```bash
# In .env, use different port
REDIS_URL=redis://localhost:6380
```

---

## Quick Commands

```bash
# Start Redis
brew services start redis

# Stop Redis
brew services stop redis

# Restart Redis
brew services restart redis

# Check status
brew services list | grep redis

# Connect to Redis CLI
redis-cli

# Test connection
redis-cli ping
```

---

## What Uses Redis?

1. **Caching** (`CacheUtil`) - Speeds up database queries
2. **Background Jobs** - Email sending, stock alerts
3. **Rate Limiting** - API request throttling
4. **Session Storage** (if configured)

All of these have **in-memory fallbacks**, so your app works without Redis, just less efficiently.

---

## Production Recommendation

For production, **Redis is highly recommended** for:
- Better performance (caching)
- Reliable background jobs
- Distributed rate limiting
- Session management

Install it on your production server or use a managed Redis service (AWS ElastiCache, Redis Cloud, etc.).

