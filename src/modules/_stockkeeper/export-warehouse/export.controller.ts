import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AdminGuard } from "src/modules/auth/guards/admin.guard";
import { StockkeeperGuard } from "src/modules/auth/guards/stockkeeper.guard";
import { ExportWareHouseRequestDto } from "./dto/request.dto";
import { ExportWareHouseService } from "./export.service";

@ApiTags('stockkeeper: export-warehouse')
@Controller('/stockkeeper/export-warehouse')
export class ExportWareHouseController {
    constructor(private readonly exportWareHouseService: ExportWareHouseService) { }

    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
    @Get()
    async getAll() {
        return await this.exportWareHouseService.getAll();
    }

    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
    @Get(':id')
    async getOneFor(@Param('id') id: string) {
        return await this.exportWareHouseService.getOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
    @Post()
    async create(@Body() body: ExportWareHouseRequestDto.ExportWareHouse) {
        return await this.exportWareHouseService.create(
            ExportWareHouseRequestDto.ExportWareHouse.plainToClass(body),
        );
    }

    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
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
    @UseGuards(StockkeeperGuard)
    @Delete(':id')
    async deleteHard(@Param('id') id: string) {
        return await this.exportWareHouseService.delete(id);
    }

    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
    @Delete('soft-delete/:id')
    async delete(@Param('id') id: string) {
        return await this.exportWareHouseService.softDelete(id);
    }


    @ApiBearerAuth()
    @UseGuards(StockkeeperGuard)
    @Get('filter/:staff_name/:created_date')
    async filterByStaffNameAndCreatedDate(
        @Param('staff_name') staff_name: string,
        @Param('created_date') created_date: Date,
    ) {
        return this.exportWareHouseService.filterByStaffNameAndCreatedDate(staff_name, created_date);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('admin')
    async adminGetAll() {
        return await this.exportWareHouseService.adminGetAll();
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put('admin/:ticketId/:isAccept')
    async adminUpdateStatus(
        @Param('ticketId') ticketId: UUID,
        @Param('isAccept') isAccept: boolean,
    ) {
        return await this.exportWareHouseService.adminUpdateStatus( ticketId, isAccept);
    }
}
