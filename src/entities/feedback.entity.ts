import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { RequestEntity } from './request.entity';

export enum FeedbackRating {
  PROBLEM_FIXED = 'PROBLEM_FIXED',
  PROBLEM_NOT_FIXED = 'PROBLEM_NOT_FIXED',
}

@Entity({
  name: 'FEEDBACK',
})
export class FeedbackEntity extends BaseEntity {
  @ManyToOne(() => RequestEntity, (request) => request.feedback)
  request: RequestEntity;

  @ManyToOne(() => AccountEntity, (account) => account.id, {
    nullable: true,
  })
  requester: AccountEntity;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

  @Column({
    type: 'text',
    default: FeedbackRating.PROBLEM_FIXED,
  })
  rating: FeedbackRating;
}
