import { BaseEntity } from 'src/common/base/entity.base';
import { AccountEntity } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({
  name: 'REQUEST_TIMELINE',
})
export class RequestTimeline extends BaseEntity {
  @ManyToOne(() => AccountEntity, (acc) => acc.id, {
    nullable: true,
  })
  createdBy?: AccountEntity;

  @ManyToOne(() => RequestEntity, (req) => req.id, {
    nullable: false,
  })
  request: RequestEntity;

  @Column({
    type: 'text',
    nullable: false,
  })
  action: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  visibleToUser: boolean;
}
