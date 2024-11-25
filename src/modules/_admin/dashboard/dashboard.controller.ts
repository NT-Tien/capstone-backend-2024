import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "src/modules/auth/guards/admin.guard";

@ApiTags('admin: machine-model')
@UseGuards(AdminGuard)
@Controller('dashboard')
export class DashboardController {
    
}