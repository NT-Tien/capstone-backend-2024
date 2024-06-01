import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, OneToMany } from "typeorm";
import { TaskTypeErrorsEntity } from "./task-type-errors.entity";

@Entity({
    name: 'TYPE_ERROR',
})
export class TypeErrorEntity extends BaseEntity{
    @OneToMany(() => TaskTypeErrorsEntity, taskTypeErrors => taskTypeErrors.id)
    taskTypeErrors: TaskTypeErrorsEntity;

    @Column({
        name: 'name',
        type: 'text',
    })
    name: string;

    @Column({
        name: 'description',
        type: 'text',
    })
    description: string;
}