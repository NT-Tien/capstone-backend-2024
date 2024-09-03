import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace TypeErrorRequestDto {
  export class TypeErrorCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    duration: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    machineModel: string;
  }

  export class TypeErrorUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    duration?: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    machineModel?: string;
  }
}
