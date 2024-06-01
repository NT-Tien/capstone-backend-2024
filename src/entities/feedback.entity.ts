import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { TaskEntity } from "./task.entity";
import { AccountEntity } from "./account.entity";

@Entity({
    name: 'FEEDBACK',
})
export class FeedbackEntity extends BaseEntity{
    @OneToOne(() => TaskEntity, task => task.id)
    @JoinColumn({name: "task_id"})
    task: TaskEntity;

    @ManyToOne(() => AccountEntity, account => account.id)
    @JoinColumn({name: "account_id"})
    account: AccountEntity;

    @Column({
        name: 'content',
        type: 'text',
    })
    content: string;
}