import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { StaffRequestChangeSparePartStatus } from 'src/entities/staff_request_change_spare_part.entity';

// export class StaffRequestChangeSparePartEntity extends BaseEntity {
//   @ManyToOne(
//       () => IssueSparePartEntity,
//       (issueSparePart) => issueSparePart.issue,
//   )
//   issueSparePart: IssueSparePartEntity;

//   @Column({
//       name: 'quantity',
//       type: 'int',
//   })
//   quantity: number;

//   @ManyToOne(() => AccountEntity, (account) => account.id)
//   fixer?: AccountEntity;

//   @ManyToOne(() => AccountEntity, (account) => account.id)
//   stockkeeper?: AccountEntity;

//   @Column({
//       name: 'status',
//       enum: StaffRequestChangeSparePartStatus,
//       default: StaffRequestChangeSparePartStatus.PENDING,
//   })
//   status: StaffRequestChangeSparePartStatus;
// }

export namespace StaffRequestChangeSparePartRequestDto {

  export class StaffRequestChangeSparePartCreateDto extends BaseDTO { 
    // @ApiProperty()
    // @IsNotEmpty()
    // issueSparePart: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // quantity: number;

    // @ApiProperty()
    // @IsNotEmpty()
    // fixer: string;

    @ApiProperty()
    @IsNotEmpty()
    stockkeeper: string;

    @ApiProperty()
    @IsNotEmpty()
    status: StaffRequestChangeSparePartStatus;
  }

  export class StaffRequestChangeSparePartUpdateDto extends PartialType(StaffRequestChangeSparePartCreateDto) { }
}
