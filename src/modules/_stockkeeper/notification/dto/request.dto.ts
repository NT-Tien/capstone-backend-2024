import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';
import { TaskStatus } from 'src/entities/task.entity';

export namespace NotificationRequestDto {
  export class StockkeeperReturnSparePart extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    stockkeeper_signature: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    staff_signature: string;
  }
  export class TaskConfirmReceiptDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    staff_signature: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    stockkeeper_signature: string
  }
  export class TaskSearchQueryDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiPropertyOptional({ type: 'boolean' })
    @IsOptional()
    @Expose()
    priority?: boolean;

    @ApiPropertyOptional({ enum: TaskStatus })
    @IsOptional()
    @Expose()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

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
    requestId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    fixerName?: string;

    @ApiPropertyOptional({ type: 'boolean' })
    @IsOptional()
    @Expose()
    confirmReceipt?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    fixerDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    totalTime?: number;
  }

  export class TaskOrderQueryDto extends BaseDTO {
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    @Expose()
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
      enum: ['createdAt', 'updatedAt', 'totalTime', 'name'],
    })
    @IsOptional()
    @IsEnum(['createdAt', 'updatedAt', 'totalTime', 'name'])
    @Expose()
    orderBy?: 'createdAt' | 'updatedAt' | 'totalTime' | 'name';
  }
  export class TaskCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    priority: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    operator: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    totalTime?: number;
  }

  export class TaskUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    priority?: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    operator?: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    totalTime?: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: RequestStatus;
  }

  export class TaskAssignFixerDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    fixer: string; // account id
  }

  export class StockkeeperPendingSparePart extends BaseDTO {
    stockkeeperNote: string;
  }

  export class StockkeeperCancelTask extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    reason: string
  }
}
