import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestEntity } from "src/entities/request.entity";
import { AccountEntity } from "src/entities/account.entity";
import { AuthModule } from "../auth/auth.module";
import { TaskEntity } from "src/entities/task.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([RequestEntity, TaskEntity, AccountEntity]),
        AuthModule,
      ],
})
export class HeadstaffModule {}