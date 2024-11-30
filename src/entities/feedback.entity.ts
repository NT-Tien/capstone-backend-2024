import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { TaskEntity } from './task.entity';
import { AccountEntity } from './account.entity';
import { RequestEntity } from './request.entity';

@Entity({
  name: 'FEEDBACK',
})
export class FeedbackEntity extends BaseEntity {
  @OneToOne(() => RequestEntity, (request) => request.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'request_id' })
  request: RequestEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id, {
    nullable: false,
  })
  requester: AccountEntity;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;
}
