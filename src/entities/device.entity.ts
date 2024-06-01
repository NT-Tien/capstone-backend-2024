import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { PositionEntity } from "./position.entity";
import { MachineModelEntity } from "./machine-model.entity";

@Entity({
    name: 'DEVICE',
})
export class DeviceEntity extends BaseEntity{
    @OneToOne(() => PositionEntity, position => position.device)
    @JoinColumn({name: "postion_id"})
    position: PositionEntity;

    @ManyToOne(() => MachineModelEntity, machineModel => machineModel.devices)
    machineModel: MachineModelEntity;

    @Column({
        name: 'description',
        type: 'text',
    })
    description: string;

    @Column({
        name: 'status',
        type: 'boolean',
        default: true,
    })
    status: boolean;

    @Column({
        name: 'operation_info',
        type: 'float'
    })
    operationStatus: number;
}