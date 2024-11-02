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
    @IsOptional()
    @Expose()
    status?: RequestStatus;

    @ApiProperty()
    @IsOptional()
    @Expose()
    checker: string; // the last checker

    @ApiProperty()
    @IsOptional()
    @Expose()
    checker_date: string; // the last checker date

    @ApiProperty()
    @IsOptional()
    @Expose()
    checker_note: string; // the last checker note

    @ApiProperty()
    @IsOptional()
    @Expose()
    is_seen: boolean; // the last checker note

    @ApiProperty()
    @IsOptional()
    @Expose()
    is_warranty: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    return_date_warranty: Date;

    @ApiProperty()
    @IsOptional()
    @Expose()
    is_rennew: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    is_request_add_device: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    is_renew_done: boolean; // for admin update
  }

  export class RequestApproveToWarranty extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    note: string;
  }
}
