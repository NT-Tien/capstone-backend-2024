import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "src/modules/auth/guards/admin.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags('admin: dashboard')
@UseGuards(AdminGuard)
@Controller('dashboard')
export class DashboardController {
    
    constructor(
        @Inject(DashboardService) private dashboardService: DashboardService,
    ) { }

    @Get('device-waranty-data')
    async getDeviceWarantyData() {
        return await this.dashboardService.getDeviceWarantyData();
    }

    @Get('device-renew-data')
    async getDeviceRenewData() {
        return await this.dashboardService.getRequestRenewData();
    }

}