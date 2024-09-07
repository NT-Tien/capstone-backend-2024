import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace RequestRequestDto {
  export class RequestCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    device: string;
  }

  export class RequestUpdateDto extends BaseDTO {
    @ApiProperty()
    @Expose()
    is_renew_done: boolean; // for admin update
  }


  export class AdminConfirmRenewUpdateDto extends BaseDTO {
    @ApiProperty()
    @Expose()
    is_renew_done: boolean; // for admin update
  }
}
