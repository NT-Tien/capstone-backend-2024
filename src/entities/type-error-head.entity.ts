import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';

@Entity({
  name: 'TYPE_ERROR_HEAD',
})
export class TypeErrorHeadEntity extends BaseEntity {
  @ManyToOne(() => MachineModelEntity, (machineModel) => machineModel.id, {
    nullable: false,
  })
  machineModel: MachineModelEntity;

  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @Column({
    name: 'duration',
    type: 'int',
  })
  duration: number;

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;
}
