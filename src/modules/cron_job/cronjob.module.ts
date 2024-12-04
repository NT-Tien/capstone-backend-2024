import { Module } from "@nestjs/common";
import { CronJobService } from "./cronjob.service";

@Module({
    imports: [],
    controllers: [],
    providers: [CronJobService],
})
export class CronJobModule { }