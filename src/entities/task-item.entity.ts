import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { TaskEntity } from "./task.entity";
import { SparePartEntity } from "./spare-part.entity";

@Entity({
    name: 'TASK_ITEM',
})
export class TaskItemEntity extends BaseEntity{
    @ManyToOne(() => TaskEntity, task => task.id)
    task: TaskEntity;

    @ManyToOne(() => SparePartEntity, sparePart => sparePart.id)
    sparePart: SparePartEntity;

    @Column({
        name: 'quantity',
        type: 'int',
    })
    quantity: number;

}