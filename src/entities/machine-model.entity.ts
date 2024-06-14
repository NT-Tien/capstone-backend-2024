import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { SparePartEntity } from './spare-part.entity';
import { DeviceEntity } from './device.entity';

@Unique([
  'name',
  'manufacturer',
  'yearOfProduction',
  'dateOfReceipt',
  'warrantyTerm',
])
@Entity({
  name: 'MACHINE_MODEL',
})
export class MachineModelEntity extends BaseEntity {
  @OneToMany(() => DeviceEntity, (device) => device.machineModel)
  devices: DeviceEntity[];

  @OneToMany(() => SparePartEntity, (sparePart) => sparePart.machineModel)
  spareParts: SparePartEntity[];

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'manufacturer',
    type: 'text',
    nullable: true,
  })
  manufacturer: string;

  @Column({
    name: 'year_of_production',
    type: 'int',
  })
  yearOfProduction: number;

  @Column({
    name: 'date_of_receipt',
    type: 'date',
  })
  dateOfReceipt: Date;

  @Column({
    name: 'warranty_term',
    type: 'date',
    nullable: true,
  })
  warrantyTerm: Date;
}
