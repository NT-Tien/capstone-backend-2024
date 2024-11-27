import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "src/entities/account.entity";
import { DeviceEntity } from "src/entities/device.entity";
import { RequestEntity } from "src/entities/request.entity";
import { AuthModule } from "src/modules/auth/auth.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TaskEntity } from "src/entities/task.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RequestEntity,
            AccountEntity,
            DeviceEntity,
            TaskEntity,
        ]),
        AuthModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }