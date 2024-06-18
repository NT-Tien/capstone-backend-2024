import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "src/entities/account.entity";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { StaffService } from "./staff.service";

@Module({
    imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '4h', algorithm: 'HS256' },
        }),
        TypeOrmModule.forFeature([AccountEntity]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: 'STAFF_SERVICE_MAIDTS',
          useClass: StaffService,
        },
      ],
      exports: [
        {
          provide: 'STAFF_SERVICE_MAIDTS',
          useClass: StaffService,
        },
      ],
})
export class StaffModule {}