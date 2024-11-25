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

}