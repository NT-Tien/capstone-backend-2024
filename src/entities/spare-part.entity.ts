import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';

@Entity({
  name: 'SPARE_PART',
})
export class SparePartEntity extends BaseEntity {
  @ManyToOne(() => MachineModelEntity, (machineModel) => machineModel.id, {
    nullable: false,
  })
  machineModel: MachineModelEntity;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'quantity',
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: string;

  @Column({
    name: 'Expiration_date',
    nullable: true,
  })
  expirationDate: Date;
}
