import { Module } from "@nestjs/common";
import { IssueController } from "./issue.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IssueEntity } from "src/entities/issue.entity";
import { SparePartEntity } from "src/entities/spare-part.entity";
import { TaskEntity } from "src/entities/task.entity";
import { IssueService } from "./issue.service";

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity, SparePartEntity, IssueEntity])],
    controllers: [IssueController],
    providers: [IssueService],
})
export class IssueModule {}