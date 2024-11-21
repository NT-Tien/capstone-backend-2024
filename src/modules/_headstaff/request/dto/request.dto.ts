import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus, RequestType } from 'src/entities/request.entity';

export namespace RequestRequestDto {

  export class IsMultipleTypesQuery extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    isMultiple?: boolean
  }
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

    @ApiProperty({ enum: RequestStatus })
    @IsOptional()
    @Expose()
    type?: RequestType;

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

  export class SparePartDto {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    sparePart: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;
  }

  export class IssueCreateOneDto {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    typeError: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    fixType: string;

    @ApiProperty({ type: [SparePartDto] })
    @IsArray()
    @Expose()
    spareParts: SparePartDto[];
  }

  export class RequestApproveToFix extends BaseDTO {
    @ApiProperty({ type: [IssueCreateOneDto] })
    @IsArray()
    @IsNotEmpty()
    @Expose()
    issues: IssueCreateOneDto[];
  }

  export class RequestApproveToWarranty extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    note: string;
  }

  export class RequestApproveToRenew extends BaseDTO {
    @ApiProperty({ description: 'ID of new device' })
    @IsNotEmpty()
    @IsUUID()
    @Expose()
    deviceId: string;

    @ApiPropertyOptional({ description: 'Note for renew (idk)' })
    @IsOptional()
    @IsString()
    @Expose()
    note?: string;
  }
}
