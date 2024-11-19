import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { StockkeeperGuard } from "src/modules/auth/guards/stockkeeper.guard";
import { ExportWareHouseService } from "./export.service";
import { ExportWareHouseRequestDto } from "./dto/request.dto";
import { get } from "http";


@ApiTags('stockkeeper: export-warehouse')
@UseGuards(StockkeeperGuard)
@Controller('/stockkeeper/export-warehouse')
export class ExportWareHouseController {
    constructor(private readonly exportWareHouseService: ExportWareHouseService) { }

    @ApiBearerAuth()
    @Get()
    async getAll() {
        return await this.exportWareHouseService.getAll();
    }

    @ApiBearerAuth()
    @Get(':id')
    async getOneFor(@Param('id') id: string) {
        return await this.exportWareHouseService.getOne(id);
    }

    @ApiBearerAuth()
    @Post()
    async create(@Body() body: ExportWareHouseRequestDto.ExportWareHouse) {
        return await this.exportWareHouseService.create(
            ExportWareHouseRequestDto.ExportWareHouse.plainToClass(body),
        );
    }

    @ApiBearerAuth()
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: ExportWareHouseRequestDto.ExportWareHouse,
    ) {
        return await this.exportWareHouseService.update(
            id,
            ExportWareHouseRequestDto.ExportWareHouse.plainToClass(body),
        );
    }

    @ApiBearerAuth()
    @Delete(':id')
    async deleteHard(@Param('id') id: string) {
        return await this.exportWareHouseService.delete(id);
    }

    @ApiBearerAuth()

    @Delete('soft-delete/:id')
    async delete(@Param('id') id: string) {
        return await this.exportWareHouseService.softDelete(id);
    }


    @ApiBearerAuth()
    @Get('filter/:staff_name/:created_date')
    async filterByStaffNameAndCreatedDate(
        @Param('staff_name') staff_name: string,
        @Param('created_date') created_date: Date,
    ) {
        return this.exportWareHouseService.filterByStaffNameAndCreatedDate(staff_name, created_date);
    }
}
