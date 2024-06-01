import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RateLimiting } from './ApplyMiddlewares/rate.limiting';

@Module({})
export class MyMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiting).forRoutes('*');
  }
}
