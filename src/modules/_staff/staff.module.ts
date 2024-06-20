import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "src/entities/account.entity";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { TaskEntity } from "src/entities/task.entity";
import { TaskModule } from "../_staff/task/task.module";

@Module({
  imports: [
    TaskModule,
    
  ],
})
export class StaffModule {}