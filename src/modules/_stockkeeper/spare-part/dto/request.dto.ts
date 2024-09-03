import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace SparePartRequestDto {
  export class SparePartUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;
  }
}
