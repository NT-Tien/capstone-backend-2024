import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace RequestRequestDto {
  export class RequestCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    device: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    requester: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    requester_note: string;
  }

  export class RequestUpdateDto extends BaseDTO {
    // @ApiProperty()
    // @ValidateIf((o) => o.task)
    // @Expose()
    // task?: string;

    @ApiProperty()
    @ValidateIf((o) => o.requester_note)
    @Expose()
    requester_note?: string;

    @ApiProperty()
    @ValidateIf((o) => o.status)
    @Expose()
    status?: RequestStatus;
  }
}
