import { BaseEntity } from 'src/common/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IssueSparePartEntity } from './issue-spare-part.entity';
import { AccountEntity } from './account.entity';

export enum StaffRequestChangeSparePartStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

@Entity({
    name: 'STAFF_REQUEST_CHANGE_SPARE_PART',
})
export class StaffRequestChangeSparePartEntity extends BaseEntity {
    @ManyToOne(
        () => IssueSparePartEntity,
        (issueSparePart) => issueSparePart.issue,
    )
    issueSparePart: IssueSparePartEntity;

    @Column({
        name: 'quantity',
        type: 'int',
    })
    quantity: number;

    @ManyToOne(() => AccountEntity, (account) => account.id)
    fixer?: AccountEntity;

    @ManyToOne(() => AccountEntity, (account) => account.id)
    stockkeeper?: AccountEntity;

    @Column({
        name: 'status',
        enum: StaffRequestChangeSparePartStatus,
        default: StaffRequestChangeSparePartStatus.PENDING,
    })
    status: StaffRequestChangeSparePartStatus;
}
