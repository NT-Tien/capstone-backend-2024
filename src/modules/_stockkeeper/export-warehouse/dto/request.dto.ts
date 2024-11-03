import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace ExportWareHouseRequestDto {
  export class ExportWareHouse extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    status: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    reason_delay: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    reason_cancel: string;

  }
}
