import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class BigIntSerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) return data;
        return JSON.parse(
          JSON.stringify(data, (_key, value) =>
            typeof value === 'bigint' ? Number(value) : value,
          ),
        );
      }),
    );
  }
}
