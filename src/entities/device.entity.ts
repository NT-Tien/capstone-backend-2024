import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { MachineModelEntity } from "./machine-model.entity";
import { AreaEntity } from "./area.entity";

@Entity({
    name: 'DEVICE',
})
export class DeviceEntity extends BaseEntity{

    @ManyToOne(() => AreaEntity, area => area.id)
    area: AreaEntity;

    @Column({
        name: 'position_x',
        type: 'int',
    })
    positionX: number;

    @Column({
        name: 'position_y',
        type: 'int',
    })
    positionY: number;

    @ManyToOne(() => MachineModelEntity, machineModel => machineModel.id)
    machineModel: MachineModelEntity;

    @Column({
        name: 'description',
        type: 'text',
    })
    description: string;

    @Column({
        name: 'operation_info',
        type: 'float'
    })
    operationStatus: number;
}