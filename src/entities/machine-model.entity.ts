import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { SparePartEntity } from './spare-part.entity';
import { DeviceEntity } from './device.entity';
import { TypeErrorEntity } from './type-error.entity';
import { TypeErrorHeadEntity } from './type-error-head.entity';

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

  @OneToMany(() => TypeErrorEntity, (typeError) => typeError.machineModel)
  typeErrors: TypeError[];

  @OneToMany(() => TypeErrorEntity, (typeError) => typeError.machineModel)
  typeErrorsHead: TypeErrorHeadEntity[];

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
    nullable: true,
    // asian/ho-chi-minh
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateOfReceipt: Date;

  @Column({
    name: 'warranty_term',
    nullable: true,
  })
  warrantyTerm: Date;

  @Column({
    name: 'image',
    type: 'text',
    nullable: true,
  })
  image?: string;

  @Column({
    name: 'needle-type',
    type: 'text',
    nullable: true,
  })
  needleType?: string;

  @Column({
    name: 'speed',
    type: 'text',
    nullable: true,
  })
  speed?: string;

  @Column({
    name: 'power',
    type: 'text',
    nullable: true,
  })
  power?: string;

  @Column({
    name: 'stitch',
    type: 'text',
    nullable: true,
  })
  stitch?: string;

  @Column({
    name: 'presser',
    type: 'text',
    nullable: true,
  })
  presser?: string;

  @Column({
    name: 'lubrication',
    type: 'text',
    nullable: true,
  })
  lubrication?: string;

  @Column({
    name: 'voltage',
    type: 'text',
    nullable: true,
  })
  voltage?: string;

  @Column({
    name: 'fabric',
    type: 'text',
    nullable: true,
  })
  fabric?: string;

  @Column({
    name: 'features',
    type: 'text',
    nullable: true,
  })
  features?: string;

  @Column({
    name: 'size',
    type: 'text',
    nullable: true,
  })
  size?: string;

  @Column({
    name: 'set-up',
    type: 'text',
    nullable: true,
  })
  setUp?: string;
}
