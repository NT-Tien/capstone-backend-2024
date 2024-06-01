import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { AccountEntity } from "./account.entity";
import { TaskEntity } from "./task.entity";

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}
@Entity({
    name: "REQUEST",
    orderBy: {
        createdAt: "DESC",
    },
})
export class RequestEntity extends BaseEntity {
    @OneToOne(() => TaskEntity, task => task.id)
    task: TaskEntity; // OneToOne relation with TaskEntity

    @ManyToOne(() => DeviceEntity, device => device.id)
    device: DeviceEntity;

    @ManyToOne(() => AccountEntity, acc => acc.id)
    account: AccountEntity;

    @Column({
        name: "description",
        type: "text",
    })
    description: string;

    @Column({
        name: "status",
        type: "enum",
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    })
    status: RequestStatus;
}