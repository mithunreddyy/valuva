import { createApp } from './app';
import { prisma } from './config/database';
import { env } from './config/env';

const app = createApp();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(env.PORT, () => {
      console.log(`
      ╔════════════════════════════════════════╗
      ║                                        ║
      ║   🚀 Server is running                ║
      ║   📍 Port: ${env.PORT}                       ║
      ║   🌍 Environment: ${env.NODE_ENV}      ║
      ║   🔗 API: http://localhost:${env.PORT}${'/api/v1'} ║
      ║                                        ║
      ╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log('\n⏳ Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('✅ Database disconnected');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();