import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace SparePartRequestDto {
  export class AllSparePartsFilterDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    minQuantity?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    maxQuantity?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    machineModelId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    id?: string;
  }

  export class AllSparePartsOrderDto extends BaseDTO {
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    @Expose()
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
      enum: ['createdAt', 'updatedAt', 'quantity', 'name'],
    })
    @IsOptional()
    @IsEnum(['createdAt', 'updatedAt', 'quantity', 'name'])
    @Expose()
    orderBy?: 'createdAt' | 'updatedAt' | 'quantity' | 'name';
  }

  class SingleSparePart {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    sparePartName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    machineModelName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;
  }
  export class ImportSparePartDto extends BaseDTO {
    @ApiProperty({ type: [SingleSparePart] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SingleSparePart)
    @Expose()
    spareParts: SingleSparePart[];
  }

  export class SparePartUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;
  }
}
