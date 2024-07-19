import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { TaskEntity } from './task.entity';

export enum Role {
  admin = 'admin', // Role for super admin
  manager = 'manager', // Role for manager for review actions in the system
  head = 'head', // Role for head of department in the system
  headstaff = 'headstaff', // Role for head of mantainance department in the system
  staff = 'staff', // Role for mantainance staff in the system
  stockkeeper = 'stockkeeper', // Role for stock keeper in the system
}

@Unique(['username'])
@Entity({
  name: 'ACCOUNT',
})
export class AccountEntity extends BaseEntity {
  @Column({
    name: 'Username',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'Phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'Password',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'Role',
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role: Role;

  @OneToMany(() => TaskEntity, (task) => task.fixer)
  tasks: TaskEntity[];
}
