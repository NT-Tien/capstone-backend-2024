import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';
import { TaskStatus } from 'src/entities/task.entity';

export namespace TaskRequestDto {
  export class DashboardInfoDto extends BaseDTO {
    @ApiProperty({
      enum: ['all', 'fix', 'warranty', 'renew'],
    })
    @IsEnum(['all', 'fix', 'warranty', 'renew'])
    @IsNotEmpty()
    @Expose()
    type: 'all' | 'fix' | 'warranty' | 'renew';

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    startDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    endDate: string;
  }
  export class TaskFilterDto extends BaseDTO {
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

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    is_warranty?: boolean;
  }

  export class TaskOrderDto extends BaseDTO {
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    @Expose()
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
      enum: ['createdAt', 'updatedAt', 'totalTime', 'name', 'fixerDate'],
    })
    @IsOptional()
    @IsEnum(['createdAt', 'updatedAt', 'totalTime', 'name', 'fixerDate'])
    @Expose()
    orderBy?: 'createdAt' | 'updatedAt' | 'totalTime' | 'name' | 'fixerDate';
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
    @IsOptional()
    @Expose()
    status?: RequestStatus;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    @Expose()
    fixerDate?: Date;
  }

  export class TaskAssignFixerDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    fixer: string; // account id
  }
}
