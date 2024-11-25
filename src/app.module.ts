import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { AllExceptionsFilter } from './common/filters/catch.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TYPE_ORM_CONFIG } from './config/orm.config';
import { QUEUE_CONFIG } from './config/queue.config';
import { CACHE_REDIS_CONFIG } from './config/redis.client';
import { MyMiddlewareModule } from './middlewares/middleware.module';
import { AdminModule } from './modules/_admin/admin.module';
import { HeadModule } from './modules/_head/head.module';
import { HeadstaffModule } from './modules/_headstaff/headstaff.module';
import { ManagerModule } from './modules/_manager/manager.module';
import { StaffModule } from './modules/_staff/staff.module';
import { StockkeeperModule } from './modules/_stockkeeper/stockkeeper.module';
import { AuthModule } from './modules/auth/auth.module';
import { HandelDataModule } from './modules/handle-data/handle-data.module';
import { PredictiveModule } from './modules/predictive-maintenance/predictive.module';
import { FileLocalModule } from './modules/upload-local/file.module';
import { ImageModule } from './modules/upload/image/image.module';
import { VideoModule } from './modules/upload/video/video.module';
import { Global_NotificationsModule } from 'src/modules/notifications/notifications.module';
import { AppController } from 'src/app.controller';
import { TaskEntity } from 'src/entities/task.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { AreaEntity } from 'src/entities/area.entity';

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
    AdminModule,
    ManagerModule,
    HeadModule,
    HeadstaffModule,
    StaffModule,
    StockkeeperModule,
    PredictiveModule,
    HandelDataModule,
    Global_NotificationsModule,
    TypeOrmModule.forFeature([TaskEntity, RequestEntity, AreaEntity]),
    // NotifyModule,
  ],
  controllers: [AppController],
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
