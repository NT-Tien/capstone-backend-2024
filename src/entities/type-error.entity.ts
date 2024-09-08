import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MachineModelEntity } from './machine-model.entity';

@Entity({
  name: 'TYPE_ERROR',
})
export class TypeErrorEntity extends BaseEntity {
  @ManyToOne(() => MachineModelEntity, (machineModel) => machineModel.id)
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

  // @Column({
  //   name: 'count',
  //   type: 'int',
  //   default: 0, // Giá trị mặc định của count là 0
  // })
  // count: number;

  // // Phương thức để tăng giá trị của count mỗi khi có task mới tham chiếu tới lỗi này
  // incrementCount() {
  //   this.count++;
  // }
  // // Phương thức để giảm giá trị của count mỗi khi có task bị xóa tham chiếu tới lỗi này
  // decrementCount() {
  //   this.count--;
  // }
}
