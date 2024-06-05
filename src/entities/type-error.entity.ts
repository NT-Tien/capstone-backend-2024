import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, OneToMany } from "typeorm";
import { TaskItemEntity } from "./task-item.entity";

@Entity({
    name: 'TYPE_ERROR',
})
export class TypeErrorEntity extends BaseEntity{

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

    @Column({
        name: 'count',
        type: 'int',
        default: 0 // Giá trị mặc định của count là 0
    })
    count: number;

    @OneToMany(() => TaskItemEntity, taskItem => taskItem.typeError)
    tasks: TaskItemEntity[];

    // Phương thức để tăng giá trị của count mỗi khi có task mới tham chiếu tới lỗi này
    incrementCount() {
        this.count++;
    }
    // Phương thức để giảm giá trị của count mỗi khi có task bị xóa tham chiếu tới lỗi này
    decrementCount() {
        this.count--;
    }
    
}