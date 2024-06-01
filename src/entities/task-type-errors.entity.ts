import { BaseEntity } from "src/common/base/entity.base";
import { Entity, ManyToOne } from "typeorm";
import { TaskEntity } from "./task.entity";
import { TypeErrorEntity } from "./type-error.entity";

@Entity({
    name: 'TASK_TYPE_ERRORS',
})
export class TaskTypeErrorsEntity extends BaseEntity{
    @ManyToOne(() => TaskEntity, task => task.id)
    task: TaskEntity;

    @ManyToOne(() => TypeErrorEntity, typeError => typeError.id)
    typeErrors: TypeErrorEntity[];
}