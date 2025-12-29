# 🚀 Getting Started Guide

**Quick start guide for new developers joining the Valuva E-Commerce Platform project.**

---

## 📋 Prerequisites

- **Node.js**: v18+ 
- **PostgreSQL**: v14+
- **Redis**: v6+ (optional, for caching)
- **npm** or **yarn**

---

## 🏗️ Project Structure

```
valuva/
├── backend/          # Express.js API server
├── frontend/         # Next.js React application
├── documentation/    # Complete documentation
└── prisma/          # Database schema (in backend/)
```

---

## ⚙️ Backend Setup

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Environment Variables**
Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/valuva_db
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### **3. Database Setup**
```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Seed database (optional)
npm run prisma:seed
```

### **4. Start Development Server**
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

## 🎨 Frontend Setup

### **1. Install Dependencies**
```bash
cd frontend
npm install
```

### **2. Environment Variables**
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### **3. Start Development Server**
```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Default Admin Credentials

After seeding:
- **Email**: `admin@valuva.com`
- **Password**: `Admin@123`

---

## 📚 Documentation Navigation

### **For Backend Development**
1. Start with [Core Application](./../backend/01-core-application.md)
2. Review [Authentication](./../backend/02-authentication.md)
3. Check [Utilities](./../backend/12-utilities-middleware.md)

### **For Frontend Development**
1. Start with [Frontend Core](./../frontend/01-core-application.md)
2. Review [Components](./../frontend/07-components.md)
3. Check [State Management](./../frontend/08-state-management.md)

### **For API Integration**
1. Start with [API Overview](./../api/01-api-overview.md)
2. Review endpoint documentation
3. Check [Swagger Docs](http://localhost:5000/api/v1/docs)

### **Finding Specific Files**
- Use [File Index](./../FILE_INDEX.md) to locate any file
- Check documentation status
- Navigate to relevant documentation

---

## 🧪 Testing the Setup

### **1. Test Backend Health**
```bash
curl http://localhost:5000/health
```

### **2. Test API**
```bash
# Get products
curl http://localhost:5000/api/v1/products

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### **3. Test Frontend**
- Open `http://localhost:3000`
- Navigate to login/register
- Test product browsing

---

## 🛠️ Common Commands

### **Backend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run prisma:studio  # Open Prisma Studio
```

### **Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

---

## 📖 Key Concepts

### **Backend Architecture**
- **MVC Pattern**: Controllers → Services → Repositories
- **Middleware**: Authentication, validation, error handling
- **Utilities**: Reusable helper functions
- **Background Jobs**: Async task processing

### **Frontend Architecture**
- **Next.js App Router**: File-based routing
- **React Query**: Data fetching and caching
- **Redux/Zustand**: State management
- **TypeScript**: Type safety

### **Database**
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Primary database
- **Redis**: Caching layer

---

## 🐛 Troubleshooting

### **Database Connection Error**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Run `npm run prisma:generate`

### **Port Already in Use**
- Change `PORT` in `.env`
- Kill process using port: `lsof -ti:5000 | xargs kill`

### **Module Not Found**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### **Prisma Client Errors**
- Run `npm run prisma:generate`
- Restart TypeScript server (VS Code)

---

## 📝 Next Steps

1. **Read Core Documentation**: [Core Application](./../backend/01-core-application.md)
2. **Explore Authentication**: [Authentication Module](./../backend/02-authentication.md)
3. **Review API**: [API Overview](./../api/01-api-overview.md)
4. **Check File Index**: [File Index](./../FILE_INDEX.md)

---

## 🔗 Useful Links

- **API Documentation**: http://localhost:5000/api/v1/docs
- **Prisma Studio**: Run `npm run prisma:studio`
- **GitHub Repository**: (Add your repo URL)

---

## 💡 Tips for New Developers

1. **Start Small**: Begin with understanding authentication flow
2. **Use Documentation**: Check [File Index](./../FILE_INDEX.md) for file locations
3. **Read Code**: Follow the code examples in documentation
4. **Ask Questions**: Use team communication channels
5. **Test Locally**: Always test changes locally first

---

**Welcome to the Valuva E-Commerce Platform! 🎉**

**Last Updated**: January 2025

