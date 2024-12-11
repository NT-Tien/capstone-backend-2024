import { BaseEntity } from 'src/common/base/entity.base';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum DeviceWarrantyCardStatus {
  UNSENT = 'UNSENT',
  WC_PROCESSING = 'WC_PROCESSING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

@Entity({
  name: 'device_warranty_card',
})
export class DeviceWarrantyCardEntity extends BaseEntity {
  @Column({
    type: 'text',
    nullable: true,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: DeviceWarrantyCardStatus,
    nullable: false,
    default: DeviceWarrantyCardStatus.UNSENT,
  })
  status: DeviceWarrantyCardStatus;

  @ManyToOne(() => DeviceEntity, (e) => e.id, {
    nullable: false,
  })
  device: DeviceEntity;

  @ManyToOne(() => RequestEntity, (e) => e.id, {
    nullable: false,
  })
  request: RequestEntity;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  send_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  receive_date: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_receiverName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_receiverPhone: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  initial_note: string;

  @Column({
    name: 'initial_images',
    type: 'text',
    array: true,
    nullable: true,
    default: [],
  })
  initial_images?: string[];

  @Column({
    name: 'initial_video',
    type: 'text',
    nullable: true,
  })
  initial_video?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  send_note: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  receive_note: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_address_1: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_address_2: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_address_ward: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_address_district: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wc_address_city: string;
}
