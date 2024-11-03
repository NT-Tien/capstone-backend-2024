import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity, Role } from "src/entities/account.entity";
import { NotifyEntity } from "src/entities/notify.entity";
import { TaskEntity } from "src/entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class StaffNotifyService {
    constructor(
        @InjectRepository(NotifyEntity)
        private readonly notifyRepository: Repository<NotifyEntity>
    ) {}

    taskAssigned(task: TaskEntity, sender: AccountEntity, receiver: AccountEntity, identifier: string) {
        return this.notifyRepository.save({
            title: 'Task assigned',
            content: {
                areaName: task.device.area.name,
                deviceName: task.device.machineModel.name,
            },
            subjectId: task.id,
            roleReceiver: Role.staff,
            fromUser: sender,
            receiver,
            identifier,
            type: "task",
        })
    }
}