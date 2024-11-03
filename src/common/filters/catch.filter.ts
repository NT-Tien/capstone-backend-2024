import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    // check if the exception is not an instance of HttpException
    if (!(exception instanceof HttpException)) {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.toString(),
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else {
      // if the exception is an instance of HttpException
      const status = exception?.getStatus();
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.getResponse(),
      };
      httpAdapter.reply(ctx.getResponse(), errorResponse, status);
    }
  }
}
