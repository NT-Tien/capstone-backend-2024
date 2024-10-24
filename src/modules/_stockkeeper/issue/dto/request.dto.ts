import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace IssueRequestDto {
  export class IssueFail extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    reason: string

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    staffSignature: string

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    stockkeeperSignature: string
  }
}
