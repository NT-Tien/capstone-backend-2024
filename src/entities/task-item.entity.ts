import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { TaskEntity } from "./task.entity";
import { SparePartEntity } from "./spare-part.entity";
import { TypeErrorEntity } from "./type-error.entity";

export enum FixItemType {
    REPLACE = 'REPLACE',
    REPAIR = 'REPAIR',
}

@Entity({
    name: 'TASK_ITEM',
})
export class TaskItemEntity extends BaseEntity{
    @ManyToOne(() => TaskEntity, task => task.id)
    task: TaskEntity;

    @ManyToOne(() => SparePartEntity, sparePart => sparePart.id)
    sparePart: SparePartEntity;

    @ManyToOne(() => TypeErrorEntity, typeError => typeError.id)
    typeError: TypeErrorEntity;

        @Column({
        name: 'description',
        type: 'text'
    })
    description: string;

    @Column({
        name: 'quantity',
        type: 'int',
        nullable: true
    })
    quantity: number;

    @Column({
        name: 'fix_item_type',
        type: 'enum',
        enum: FixItemType
    })
    fixType: FixItemType;

}