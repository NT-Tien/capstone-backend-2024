import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from './config/orm.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MyMiddlewareModule } from './middlewares/middleware.module';
import { QUEUE_CONFIG } from './config/queue.config';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/upload/image/image.module';
import { VideoModule } from './modules/upload/video/video.module';
import { NotifyModule } from './modules/notify/notify.module';
import { AllExceptionsFilter } from './common/filters/catch.filter';
import { AdminModule } from './modules/_admin/admin.module';
import { ManagerModule } from './modules/_manager/manager.module';
import { HeadModule } from './modules/_head/head.module';
import { HeadstaffModule } from './modules/_headstaff/headstaff.module';
import { StaffModule } from './modules/_staff/staff.module';
import { StockkeeperModule } from './modules/_stockkeeper/stockkeeper.module';
import { PredictiveModule } from './modules/predictive-maintenance/predictive.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CACHE_REDIS_CONFIG } from './config/redis.client';
import { FileLocalModule } from './modules/upload-local/file.module';
import { HandelDataModule } from './modules/handle-data/handle-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPE_ORM_CONFIG),
    BullModule.forRoot(QUEUE_CONFIG),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore(CACHE_REDIS_CONFIG),
      }),
    }),
    MyMiddlewareModule,
    AuthModule,
    FileLocalModule,
    ImageModule,
    VideoModule,
    NotifyModule,
    AdminModule,
    ManagerModule,
    HeadModule,
    HeadstaffModule,
    StaffModule,
    StockkeeperModule,
    PredictiveModule,
    HandelDataModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
