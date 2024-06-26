import { Column, Entity, ManyToOne } from "typeorm";
import { IssueEntity } from "./issue.entity";
import { SparePartEntity } from "./spare-part.entity";
import { BaseEntity } from "src/common/base/entity.base";

export enum IssueSparePartStatus {
    PENDING = 'PENDING',
    RECIEVED = 'RECIEVED',
    RETURNED = 'RETURNED',
}

@Entity({
    name: 'ISSUE_SPARE_PART',
})
export class IssueSparePartEntity extends BaseEntity {
    @ManyToOne(() => IssueEntity, (issue) => issue.id, { nullable: false })
    issue: IssueEntity;

    @ManyToOne(() => SparePartEntity, (sparePart) => sparePart.id, { nullable: false })
    sparePart: SparePartEntity;

    @Column({
        name: 'quantity',
        type: 'int',
    })
    quantity: number;

    @Column({
        name: 'status',
        type: 'enum',
        enum: IssueSparePartStatus,
        default: IssueSparePartStatus.PENDING,
    })
    status: IssueSparePartStatus;

    @Column({
        name: 'note',
        type: 'text',
        nullable: true,
    })
    note: string;
}