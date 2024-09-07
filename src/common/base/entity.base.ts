import {
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;


  getFormattedCreatedAt(): string {
    return moment(this.createdAt).tz('Asia/Ho_Chi_Minh').format();
  }

  getFormattedUpdatedAt(): string {
    return moment(this.updatedAt).tz('Asia/Ho_Chi_Minh').format();
  }

  @BeforeUpdate()
  beforeUpdate() {
    // Chặn cập nhật trường primary key
    if (this.id !== this.id) {
      throw new Error('Cannot update primary key (id)');
    }
  }

}
