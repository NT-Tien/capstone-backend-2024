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
import { AreaModule } from './modules/area/area.module';
import { PositionModule } from './modules/position/position.module';
import { MachineModelModule } from './modules/machine-model/machine-model.module';
import { DeviceModule } from './modules/device/device.module';
import { SparePartModule } from './modules/spare-part/spare-part.module';
import { AllExceptionsFilter } from './common/exceptions/catch.exception';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPE_ORM_CONFIG),
    BullModule.forRoot(QUEUE_CONFIG),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    MyMiddlewareModule,
    AuthModule,
    ImageModule,
    AreaModule,
    PositionModule,
    MachineModelModule,
    DeviceModule,
    SparePartModule,
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
