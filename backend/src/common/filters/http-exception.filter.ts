import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exception.message,
      error: {
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };

    if (typeof exceptionResponse === 'object' && Array.isArray((exceptionResponse as any).message)) {
      errorResponse.message = (exceptionResponse as any).message[0];
      errorResponse['errors'] = (exceptionResponse as any).message;
    }

    response.status(status).json(errorResponse);
  }
}
