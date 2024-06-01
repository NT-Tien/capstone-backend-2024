import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class ApiResponse<T> {
  constructor(
    public data: T,
    public message: string = 'Success',
    public statusCode: number = 200,
  ) {}
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const responseStatusCode = context
          .switchToHttp()
          .getResponse().statusCode;
        return new ApiResponse<T>(data, 'Success', responseStatusCode);
      }),
    );
  }
}
