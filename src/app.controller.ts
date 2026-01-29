import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    // SIMULACIÓN ROLLBACK: en staging devolvemos 503 para que falle el health check.
    // Después de verificar el rollback, quitar este bloque y hacer push de la corrección.
    if (process.env.NODE_ENV === 'staging') {
      throw new HttpException(
        { status: 'error', message: 'Simulated failure for rollback demo' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    try {
      // Validar conexión a la base de datos
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        release: process.env.RELEASE_ID || 'unknown',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
          release: process.env.RELEASE_ID || 'unknown',
          environment: process.env.NODE_ENV || 'development',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
