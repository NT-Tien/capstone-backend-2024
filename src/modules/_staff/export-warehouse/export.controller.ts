import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { StockkeeperGuard } from "src/modules/auth/guards/stockkeeper.guard";
import { ExportWareHouseService } from "./export.service";
import { ExportWareHouseRequestDto } from "./dto/request.dto";
import { StaffGuard } from "src/modules/auth/guards/staff.guard";


@ApiTags('staff: export-warehouse')
@UseGuards(StaffGuard)
@Controller('/staff/export-warehouse')
export class ExportWareHouseController {
    constructor(private readonly exportWareHouseService: ExportWareHouseService) { }

    @ApiBearerAuth()
    @Get(':id')
    async getOneFor(@Param('id') id: string) {
        return await this.exportWareHouseService.getOne(id);
    }

    @ApiBearerAuth()
    @Put('checkin-export-warehouse/:id')
    async checkInExportWarehouse(
        @Param('id') id: string,
        @Headers('user') user: any,
    ) {
        return await this.exportWareHouseService.checkInExportWarehouse(id, user);
    }


}
