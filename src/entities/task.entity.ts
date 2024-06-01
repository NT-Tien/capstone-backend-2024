import { BaseEntity } from "src/common/base/entity.base";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { RequestEntity } from "./request.entity";
import { TypeErrorEntity } from "./type-error.entity";
import { TaskItemEntity } from "./task-item.entity";

@Entity({
    name: 'TASK',
})
export class TaskEntity extends BaseEntity{
    @OneToOne(() => RequestEntity, request => request.id)
    @JoinColumn({name: "request_id"})
    request: RequestEntity;

    @OneToMany(() => TaskItemEntity, taskItem => taskItem.id)
    taskItems: TaskItemEntity[];
}