import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace PositionRequestDto {
  export class PositionCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    area: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    positionX: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    positionY: number;
  }

  export class PositionUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.area)
    @Expose()
    area: string;

    @ApiProperty()
    @ValidateIf((o) => o.positionX)
    @Expose()
    positionX: number;

    @ApiProperty()
    @ValidateIf((o) => o.positionY)
    @Expose()
    positionY: number;
  }
}
