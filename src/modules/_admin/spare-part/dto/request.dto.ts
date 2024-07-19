import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

// export class SparePartEntity extends BaseEntity{
//   @ManyToOne(() => MachineModelEntity, machineModel => machineModel.id)
//   machineModel: MachineModelEntity;

//   @Column({
//       name: 'name',
//       type: 'varchar',
//       length: 100,
//       nullable: false,
//   })
//   name: string;

//   @Column({
//       name: 'quantity',
//       type: 'int',
//   })
//   quantity: number;

//   @Column({
//       name: 'Expiration_date',
//       type: 'date',
//   })
//   expirationDate: Date;
// }

export namespace SparePartRequestDto {
  export class SparePartCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    machineModel: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    image?: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    expirationDate: Date;
  }

  export class SparePartUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    machineModel: string;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    name: string;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    quantity: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    image?: string;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    expirationDate: Date;
  }
}
