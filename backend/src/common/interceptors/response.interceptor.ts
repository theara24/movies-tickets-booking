import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((responseData) => {
        if (responseData && responseData.__raw) {
          return responseData.data;
        }

        if (
          responseData &&
          responseData.data !== undefined &&
          responseData.pagination
        ) {
          return {
            success: true,
            message: responseData.message || 'Success',
            data: responseData.data,
            pagination: responseData.pagination,
          };
        }

        return {
          success: true,
          message: 'Success',
          data: responseData ?? null,
        };
      }),
    );
  }
}
