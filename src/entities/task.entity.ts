import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { RequestEntity } from "./request.entity";
import { TaskItemEntity } from "./task-item.entity";
import { AccountEntity } from "./account.entity";

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum TaskType {
    FIX = 'FIX',
    MAINTENANCE = 'MAINTENANCE',
}

@Entity({
    name: 'TASK',
})
export class TaskEntity extends BaseEntity{
    @OneToOne(() => RequestEntity, request => request.id)
    @JoinColumn({name: "request_id"})
    request: RequestEntity;

    @OneToMany(() => TaskItemEntity, taskItem => taskItem.id)
    taskItems: TaskItemEntity[];

    @ManyToOne(() => AccountEntity, account => account.id)
    @JoinColumn({name: "fixer_id"})
    fixer: AccountEntity;

    @Column({
        name: 'fixer_note',
        type: 'text'
    })
    fixerNote: string;

    @Column({
        name: 'name',
        type: 'text'
    })
    name: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING
    })
    status: TaskStatus;

    @Column({
        name: 'priority',
        type: 'boolean',
    })
    priority: boolean;

    @Column({
        name: 'operator',
        type: 'float'
    })
    operator: number;

    @Column({
        name: 'total_time',
        type: 'int'
    })
    totalTime: number;

    @Column({
        name: 'completed_at',
        type: 'timestamp',
        nullable: true
    })
    completedAt: Date;

    @Column({
        name: 'images_verify',
        type: 'text',
        array: true,
        nullable: true,
        default: []
    })
    private _imagesVerify: string[];

    get imagesVerify(): string[] {
        return this._imagesVerify;
    }

    set imagesVerify(images: string[]) {
        const maxLength = 3;
        if (images.length > maxLength) {
            throw new Error(`Độ dài của mảng không thể vượt quá ${maxLength}`);
        }
        this._imagesVerify = images;
    }

    @Column({
        name: 'videos_verify',
        type: 'text',
    })
    videosVerify: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: TaskType,
    })
    type: TaskType;

}