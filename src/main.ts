import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Leer RELEASE_ID si existe
  let releaseId = 'unknown';
  try {
    const releaseIdPath = path.join(process.cwd(), 'RELEASE_ID');
    if (fs.existsSync(releaseIdPath)) {
      releaseId = fs.readFileSync(releaseIdPath, 'utf-8').trim();
    } else {
      releaseId =
        process.env.RELEASE_ID ||
        process.env.GITHUB_SHA?.substring(0, 7) ||
        'unknown';
    }
  } catch (error) {
    logger.warn('Could not read RELEASE_ID file', error);
  }

  // Establecer RELEASE_ID como variable de entorno
  process.env.RELEASE_ID = releaseId;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL del frontend (Vue)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || 'development';

  await app.listen(port);

  logger.log(
    JSON.stringify({
      message: 'Application started',
      release: releaseId,
      environment,
      port,
      timestamp: new Date().toISOString(),
    }),
  );
}
bootstrap();
