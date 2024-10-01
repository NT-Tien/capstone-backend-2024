import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace RequestRequestDto {
  export class RequestAllFilteredDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    requester_note?: string;

    @ApiPropertyOptional({ enum: RequestStatus })
    @IsOptional()
    @Expose()
    status?: RequestStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    is_warranty?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    machineModelId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    deviceId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    areaId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    requesterName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    createdAt?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    updatedAt?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    createdAtRangeStart?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    createdAtRangeEnd?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    updatedAtRangeStart?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    updatedAtRangeEnd?: string;
  }

  export class RequestAllOrderedDto extends BaseDTO {
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    @Expose()
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
      enum: ['createdAt', 'updatedAt'],
    })
    @IsOptional()
    @IsEnum(['createdAt', 'updatedAt'])
    @Expose()
    orderBy?: 'createdAt' | 'updatedAt';
  }
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
