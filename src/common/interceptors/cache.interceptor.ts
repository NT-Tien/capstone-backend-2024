import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const key = this.getCacheKey(context);
    const cachedResponse = await this.cacheManager.get(key);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    return next.handle().pipe(
      tap(response => {
        this.cacheManager.set(key, response, 10 * 1000); // cache for 100 seconds
      })
    );
  }

  private getCacheKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    return `${request.method}-${request.url}`;
  }
}