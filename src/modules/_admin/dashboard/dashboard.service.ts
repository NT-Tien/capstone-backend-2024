import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceEntity } from "src/entities/device.entity";
import { RequestEntity, RequestStatus, RequestType } from "src/entities/request.entity";
import { TaskEntity, TaskType } from "src/entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(RequestEntity) private requestRepository: Repository<RequestEntity>,
        @InjectRepository(DeviceEntity) private deviceRepository: Repository<DeviceEntity>,
        @InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>,

    ) { }

    async getDeviceWarantyData() {
        // get request with type warranty
        let request_waranty = await this.requestRepository.find({
            where: {
                type: RequestType.WARRANTY
            },
            relations: ['device', 'tasks']
        });

        // 1. Số lượng máy đang chờ bảo hành - request.status = PENDING
        // 2. Số máy gửi tại trung tâm bảo hành request.status = IN_PROGRESS and request.tasks.type = WARRANTY_SEND and request.tasks.status = IN_PROGRESS
        // 3. Số máy sẽ nhận lại trong khoảng thời gian chọn - request.status = IN_PROGRESS and request.tasks.type = WARRANTY_RECEIVE and request.tasks.status = IN_PROGRESS
        // 4. số máy bảo hành không thành công - request.status = IN_PROGRESS and request.tasks.type = WARRANTY_RECEIVE and request.tasks.status = CANCELLED
        // 5. Số máy bảo hành thành công - request.status = IN_PROGRESS or COMPLETED and request.tasks.type = WARRANTY_RECEIVE and ( request.tasks.status = COMPLETED  Or request.tasks.status = HEAD_STAFF_CONFIRM)

        let data = {
            total: request_waranty.length,
            pending: {
                total: 0,
                devices_and_request: [],
            },
            in_center: {
                total: 0,
                devices_and_request: [],
            },
            will_receive: {
                total: 0,
                devices_and_request: [],
            },
            failed: {
                total: 0,
                devices_and_request: [],
            },
            success: {
                total: 0,
                devices_and_request: [],
            }
        }

        request_waranty.forEach(request => {
            let task = request.tasks.find(task => task.type == TaskType.WARRANTY_SEND);
            if (request.status == 'PENDING') {
                data.pending.total += 1;
                data.pending.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.status == 'IN_PROGRESS' && task.status == 'IN_PROGRESS') {
                data.in_center.total += 1;
                data.in_center.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            let task_receive = request.tasks.find(task => task.type == TaskType.WARRANTY_RECEIVE);
            if (request.status == 'IN_PROGRESS' && task_receive.status == 'IN_PROGRESS') {
                data.will_receive.total += 1;
                data.will_receive.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task_receive
                });
            }
            if (request.status == 'IN_PROGRESS' && task_receive.status == 'CANCELLED') {
                data.failed.total += 1;
                data.failed.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task_receive
                });
            }
            if ((
                request.status == RequestStatus.IN_PROGRESS ||
                request.status == RequestStatus.HEAD_CONFIRM ||
                request.status == RequestStatus.CLOSED
            ) && (task_receive.status == 'COMPLETED' || task_receive.status == 'HEAD_STAFF_CONFIRM')) {
                data.success.total += 1;
                data.success.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task_receive
                });
            }
        });

        return data;

    }

    async getRequestRenewData() {

        // export enum RequestStatus {
        //     PENDING = 'PENDING', // use for request renew
        //     HEAD_CANCEL = 'HEAD_CANCEL',
        //     APPROVED = 'APPROVED', // use for request renew
        //     IN_PROGRESS = 'IN_PROGRESS', // use for request renew
        //     CLOSED = 'CLOSED', // use for request renew
        //     HEAD_CONFIRM = 'HEAD_CONFIRM',
        //     REJECTED = 'REJECTED', // use for request renew
        //   }

        // 1. Số yêu cầu thay máy mới request.type = RENEW status = PENDING
        // 2. Số yêu cầu thay máy đang chờ duyệt request.type = RENEW status = APPROVED
        // 3. Số yêu cầu thay máy dc approve và đang thực hiện request.type = RENEW status = APPROVED
        // 4. số yêu cầu thay máy bị rejectc request.type = RENEW status = REJECTED
        // 5. số yêu cầu thay máy đang thực hiện  request.type = RENEW status = IN_PROGRESS
        // 6. số yêu cầu thay máy thay thành công request.type = RENEW status = CLOSED or HEAD_CONFIRM
        // 7. số yêu cầu thay máy đang chờ mua máy mới request.type = RENEW status = APPROVED and request.tasks.renew_device = null and request.tasks.type = TaskType

        // will get request.tasks sort created_at lastest and get first

        let request_renew = await this.requestRepository.find({
            where: {
                type: RequestType.RENEW
            },
            relations: ['tasks']
        });

        let data = {
            total: request_renew.length,
            pending: {
                total: 0,
                devices_and_request: [],
            },
            approved: {
                total: 0,
                devices_and_request: [],
            },
            in_progress: {
                total: 0,
                devices_and_request: [],
            },
            rejected: {
                total: 0,
                devices_and_request: [],
            },
            success: {
                total: 0,
                devices_and_request: [],
            },
            waiting_new_device: {
                total: 0,
                devices_and_request: [],
            }
        }

        request_renew.forEach(request => {
            let task = request.tasks.find(task => task.type == TaskType.RENEW);
            if (request.status == RequestStatus.PENDING) {
                data.pending.total += 1;
                data.pending.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.status == RequestStatus.APPROVED) {
                data.approved.total += 1;
                data.approved.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.status == RequestStatus.APPROVED && task) {
                data.waiting_new_device.total += 1;
                data.waiting_new_device.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.status == RequestStatus.REJECTED) {
                data.rejected.total += 1;
                data.rejected.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.status == RequestStatus.IN_PROGRESS) {
                data.in_progress.total += 1;
                data.in_progress.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if ((
                request.status == RequestStatus.CLOSED ||
                request.status == RequestStatus.HEAD_CONFIRM
            )) {
                data.success.total += 1;
                data.success.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
            if (request.type == RequestType.RENEW && request.status == RequestStatus.APPROVED && !task.device_renew && task.type == TaskType.RENEW) {
                data.waiting_new_device.total += 1;
                data.waiting_new_device.devices_and_request.push({
                    request: request,
                    device: request.device,
                    task: task
                });
            }
        });
        
        

    }

}