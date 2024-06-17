import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { AccountEntity } from "./account.entity";
import { BaseEntity } from "src/common/base/entity.base";

@Entity()
export class NotifyEntity extends BaseEntity {
   @ManyToOne(() => AccountEntity, (acc) => acc.id, {
        nullable: false,
        eager: true,
    })
    receiver: AccountEntity;

    @Column({
        name: 'task_id',
        type: 'uuid',
        nullable: true,
    })
    taskId: string;

    @Column({
        name: 'request_id',
        type: 'uuid',
        nullable: true,
    })
    requestId: string;

    @Column({
        name: 'status',
        type: 'boolean',
        default: false, // false is unread, true is read
    })
    status: boolean;
}