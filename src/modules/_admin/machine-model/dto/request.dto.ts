import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace MachineModelRequestDto {
  export class MachineModelBasicAllQuery extends BaseDTO {
    @ApiPropertyOptional({ type: 'boolean' })
    @IsOptional()
    @Expose()
    withDevices?: string;
  }
  export class MachineModelCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    manufacturer: string;

    @ApiProperty()
    @Expose()
    yearOfProduction: number;

    @ApiProperty()
    @Expose()
    dateOfReceipt: Date;

    @ApiProperty()
    @Expose()
    warrantyTerm: Date;
  }

  export class MachineModelUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.name !== undefined)
    @Expose()
    name: string;

    @ApiProperty()
    @ValidateIf((o) => o.description !== undefined)
    @Expose()
    description: string;

    @ApiProperty()
    @ValidateIf((o) => o.manufacturer !== undefined)
    @Expose()
    manufacturer: string;

    @ApiProperty()
    @ValidateIf((o) => o.yearOfProduction !== undefined)
    @Expose()
    yearOfProduction: number;

    @ApiProperty()
    @ValidateIf((o) => o.dateOfReceipt !== undefined)
    @Expose()
    dateOfReceipt: Date;

    @ApiProperty()
    @ValidateIf((o) => o.warrantyTerm !== undefined)
    @Expose()
    warrantyTerm: Date;
  }
}
