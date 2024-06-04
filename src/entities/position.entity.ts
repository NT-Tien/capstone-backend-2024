import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne, OneToOne, Unique } from "typeorm";
import { AreaEntity } from "./area.entity";
import { DeviceEntity } from "./device.entity";

@Unique(['area', 'positionX', 'positionY'])
@Entity({
    name: 'POSITION',
})
export class PositionEntity extends BaseEntity {
    @ManyToOne(() => AreaEntity, area => area.id)
    area: AreaEntity;

    @OneToOne(() => DeviceEntity, device => device.position)
    device: DeviceEntity; // use for one-to-one relationship when querying

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
}