import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), AuthModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
