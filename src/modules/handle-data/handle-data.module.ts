import { Module } from "@nestjs/common";
import { HandleDataController } from "./handle-data.controller";
import { HandleDataService } from "./handle-data.service";

@Module({
    providers: [HandleDataService],
    controllers: [HandleDataController],
    exports: [HandleDataService]
})
export class HandelDataModule {}