import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger();

  private getContext() {
    return {
      release: process.env.RELEASE_ID || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  log(message: string, context?: string, userId?: string) {
    const logData = {
      ...this.getContext(),
      userId: userId || 'system',
      message,
      level: 'info',
    };
    this.logger.log(JSON.stringify(logData), context);
  }

  error(message: string, trace?: string, context?: string, userId?: string) {
    const logData = {
      ...this.getContext(),
      userId: userId || 'system',
      message,
      trace,
      level: 'error',
    };
    this.logger.error(JSON.stringify(logData), trace, context);
  }

  warn(message: string, context?: string, userId?: string) {
    const logData = {
      ...this.getContext(),
      userId: userId || 'system',
      message,
      level: 'warn',
    };
    this.logger.warn(JSON.stringify(logData), context);
  }

  debug(message: string, context?: string, userId?: string) {
    const logData = {
      ...this.getContext(),
      userId: userId || 'system',
      message,
      level: 'debug',
    };
    this.logger.debug(JSON.stringify(logData), context);
  }
}
