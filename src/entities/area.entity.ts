import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity({
  name: 'AREA',
})
export class AreaEntity extends BaseEntity {
  @Column({
    name: 'Name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'Instruction',
    type: 'text',
    nullable: true,
  })
  instruction: string;

  @Column({
    name: 'width',
    type: 'int',
  })
  width: number;

  @Column({
    name: 'height',
    type: 'int',
  })
  height: number;

  @Column({
    name: 'key-position',
    type: 'text',
    nullable: true,
  })
  keyPosition?: string;

  @OneToMany(() => DeviceEntity, (device) => device.area)
  devices: DeviceEntity[];
}
