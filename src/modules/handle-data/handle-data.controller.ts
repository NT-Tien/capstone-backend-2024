import { Body, Controller, Post } from "@nestjs/common";
import { HandleDataService } from "./handle-data.service";

@Controller()
export class HandleDataController {
    constructor(private readonly handleDataService: HandleDataService) {}

    @Post('get-finish-date')
    async getFinishDate(
        @Body('create_at') create_at: string,
        @Body('totalTime') totalTime: number,
    ) {
        return await this.handleDataService.getFinishDate(create_at, totalTime);
    }
}