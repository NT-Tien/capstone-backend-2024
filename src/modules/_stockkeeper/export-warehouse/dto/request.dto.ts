import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace ExportWareHouseRequestDto {
  export class ExportWareHouse extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    reason_delay: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    reason_cancel: string;

  }
}
