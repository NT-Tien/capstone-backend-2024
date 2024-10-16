import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace TaskRequestDto {
  export class TaskCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    device: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    fixer?: string; // account id

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: RequestStatus;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    priority: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    operator: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    totalTime: number;
  }

  export class TaskUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    status?: RequestStatus;

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
  }

  export class TaskAssignFixerDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    fixer: string; // account id
  }
}
