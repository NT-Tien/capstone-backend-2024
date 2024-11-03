import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IssueEntity } from "src/entities/issue.entity";
import { SparePartEntity } from "src/entities/spare-part.entity";
import { TaskEntity } from "src/entities/task.entity";
import { ExportWareHouseController } from "./export.controller";
import { ExportWareHouseService } from "./export.service";
import { ExportWareHouse } from "src/entities/export-warehouse.entity";

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity, SparePartEntity, IssueEntity, ExportWareHouse])],
    controllers: [ExportWareHouseController],
    providers: [ExportWareHouseService],
})
export class ExportWareHouseModule {}