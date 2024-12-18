import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { CacheTTL } from '@nestjs/cache-manager';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';
import { RequestStatus } from 'src/entities/request.entity';
import { RequestService } from './request/request.service';
import { TaskService } from './task/task.service';
import { TaskStatus } from 'src/entities/task.entity';

@ApiTags('head staff: dasboard')
@UseGuards(HeadStaffGuard)
@Controller('head-staff/dashboard')
export class HeadStaffDashboardController {
    constructor(
        private readonly requestService: RequestService,
        private readonly taskService: TaskService,
    ) { }

    @ApiBearerAuth()
    @Get()
    async getAll(
        @Headers('user') user: any,
    ) {
        return Promise.all([
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.PENDING), // 0
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.APPROVED), // 1
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.IN_PROGRESS), // 2
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.CLOSED), // 3
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.HEAD_CONFIRM), // 4
            this.requestService.customHeadStaffGetAllRequestDashboard(user.id, RequestStatus.REJECTED), // 5
            this.taskService.customGetAllTaskDashboard(TaskStatus.AWAITING_FIXER),
            this.taskService.customGetAllTaskDashboard(TaskStatus.ASSIGNED),
            this.taskService.customGetAllTaskDashboard(TaskStatus.AWAITING_SPARE_SPART),
            this.taskService.customGetAllTaskDashboard(TaskStatus.IN_PROGRESS),
            this.taskService.customGetAllTaskDashboard(TaskStatus.HEAD_STAFF_CONFIRM),
            this.taskService.customGetAllTaskDashboard(TaskStatus.COMPLETED),
        ]).then(results => {
            const pendingRequests = results[0][1];
            const approvedRequests = results[1][1]
            const inProgressRequests = results[2][1]
            const closedRequests = results[3][1]
            const headConfirmRequests = results[4][1]
            const rejectedRequests = results[5][1]
            const awaitingFixerTasks = results[6][1]
            const assignedTasks = results[7][1]
            const awaitingSparePartTasks = results[8][1]
            const inProgressTasks = results[9][1]
            const headStaffConfirmTasks = results[10][1]
            const completedTasks = results[11][1]
            return {
                pendingRequests,
                approvedRequests,
                inProgressRequests,
                closedRequests,
                headConfirmRequests,
                rejectedRequests,
                awaitingFixerTasks,
                assignedTasks,
                awaitingSparePartTasks,
                inProgressTasks,
                headStaffConfirmTasks,
                completedTasks,
            };

        });
    }

    // @ApiResponse({
    //   type: RequestResponseDto.RequestGetAll,
    //   status: 200,
    //   description: 'Get all categories',
    // })
    // @CacheTTL(10)
    // @Get('get-all-cache')
    // async getAllForUser() {
    //   return await this.requestService.getAll();
    // }

    // @ApiBearerAuth()
    // @Get('include-deleted')
    // async getAllWithDeleted() {
    //   return await this.requestService.getAllWithDeleted();
    // }

    // @ApiResponse({
    //   type: RequestResponseDto.RequestGetOne,
    //   status: 200,
    //   description: 'Get one Request',
    // })
    // @ApiBearerAuth()
    // @Get(':id')
    // async getOne(@Headers('user') user: any, @Param('id') id: string) {
    //   console.log(user?.id, id);

    //   return await this.requestService.customHeadStaffGetOneRequest(user?.id, id);
    // }

    // @ApiBearerAuth()
    // @ApiResponse({
    //   type: RequestResponseDto.RequestCreate,
    //   status: 201,
    //   description: 'Create a Request',
    // })
    // @Post()
    // async create(
    //   @Headers('user') user: any,
    //   @Body() body: RequestRequestDto.RequestCreateDto
    // ) {
    //   return await this.requestService.customHeadCreateRequest(
    //     user.id,
    //     RequestRequestDto.RequestCreateDto.plainToClass(body),
    //   );
    // }

    // @ApiBearerAuth()
    // @ApiResponse({
    //   type: RequestResponseDto.RequestUpdate,
    //   status: 200,
    //   description: 'Update a Request',
    // })
    // @Put(':id/:status')
    // async update(
    //   @Headers('user') user: any,
    //   @Param('id') id: string,
    //   @Body() data: RequestRequestDto.RequestUpdateDto,
    // ) {
    //   // create task for request before update status
    //   return await this.requestService.updateStatus(user.id, id, data);
    // }

    // @ApiBearerAuth()
    // @ApiResponse({
    //   type: RequestResponseDto.RequestDelete,
    //   status: 200,
    //   description: 'Hard delete a Request',
    // })
    // @Delete(':id')
    // async deleteHard(@Param('id') id: string) {
    //   return await this.requestService.delete(id);
    // }

    // @ApiBearerAuth()
    // @ApiResponse({
    //   type: RequestResponseDto.RequestDelete,
    //   status: 200,
    //   description: 'Soft delete a Request',
    // })
    // @Delete('soft-delete/:id')
    // async delete(@Param('id') id: string) {
    //   return await this.requestService.softDelete(id);
    // }

    // @ApiBearerAuth()
    // @ApiResponse({
    //   type: RequestResponseDto.RequestRestore,
    //   status: 200,
    //   description: 'Restore a Request',
    // })
    // @Put('restore/:id')
    // async restore(@Param('id') id: string) {
    //   return await this.requestService.restore(id);
    // }
}
