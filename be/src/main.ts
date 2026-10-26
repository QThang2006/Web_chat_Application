import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Kích hoạt tính năng dừng an toàn (Graceful Shutdown) cho Systemd SIGTERM
  app.enableShutdownHooks();

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '127.0.0.1';

  await app.listen(PORT, HOST);
  logger.log(`=======================================================`);
  logger.log(`[NestJS Backend] Running on http://${HOST}:${PORT}`);
  logger.log(`[Process Info] Node ${process.version} - PID: ${process.pid}`);
  logger.log(`=======================================================`);
}
bootstrap();
