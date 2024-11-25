import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      AccountEntity,
      DeviceEntity,
    ]),
    AuthModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
