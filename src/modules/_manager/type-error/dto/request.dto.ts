import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
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
  }

  export class TypeErrorUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.name !== undefined)
    @Expose()
    name: string;

    @ApiProperty()
    @ValidateIf((o) => o.duration !== undefined)
    @Expose()
    duration: number;

    @ApiProperty()
    @ValidateIf((o) => o.description !== undefined)
    @Expose()
    description: string;
  }
}
