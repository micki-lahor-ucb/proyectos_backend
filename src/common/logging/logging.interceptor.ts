import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, user } = request;
    const now = Date.now();

    const releaseId = process.env.RELEASE_ID || 'unknown';
    const environment = process.env.NODE_ENV || 'development';
    const userId = (user as any)?.id || (user as any)?.sub || 'anonymous';

    const logContext = {
      release: releaseId,
      environment,
      userId,
      method,
      url,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };

    this.logger.log(
      `Incoming request: ${method} ${url}`,
      JSON.stringify(logContext),
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Request completed: ${method} ${url} - ${responseTime}ms`,
            JSON.stringify({ ...logContext, responseTime }),
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Request failed: ${method} ${url} - ${responseTime}ms`,
            error.stack,
            JSON.stringify({
              ...logContext,
              responseTime,
              error: error.message,
            }),
          );
        },
      }),
    );
  }
}
