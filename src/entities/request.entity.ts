import { BaseEntity } from "src/common/base/entity.base";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { DeviceEntity } from "./device.entity";

@Entity({
    name: "REQUEST",
    orderBy: {
        createdAt: "DESC",
    },
})
export class RequestEntity extends BaseEntity {
}