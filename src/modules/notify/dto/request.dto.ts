import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace NotifyDto {
  export class GetAll extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    seen: boolean;
  }
}
