import { BaseEntity } from 'src/common/base/entity.base';
import {
    Column,
    Entity,
    ManyToOne,
} from 'typeorm';
import { TaskEntity } from './task.entity';
import { TypeErrorEntity } from './type-error.entity';

export enum FixItemType {
    REPLACE = 'REPLACE',
    REPAIR = 'REPAIR',
}

export enum IssueStatus {
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    RESOLVED = 'RESOLVED',
}

@Entity({
    name: 'ISSUE',
})
export class IssueEntity extends BaseEntity {
    @ManyToOne(() => TaskEntity, (task) => task.id, { nullable: false })
    task: TaskEntity;

    @ManyToOne(() => TypeErrorEntity, (typeError) => typeError.id)
    typeError: TypeErrorEntity;

    @Column({
        name: 'description',
        type: 'text',
    })
    description: string;

    @Column({
        name: 'fix_item_type',
        type: 'enum',
        enum: FixItemType,
    })
    fixType: FixItemType;

    @Column({
        name: 'status',
        type: 'enum',
        enum: IssueStatus,
        default: IssueStatus.PENDING,
    })
    status: IssueStatus;
}
