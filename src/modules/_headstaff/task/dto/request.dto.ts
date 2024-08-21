import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace TaskRequestDto {
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
    @IsArray()
    @Expose()
    issueIDs: string[];

    @ApiProperty()
    @IsOptional()
    @Expose()
    totalTime?: number;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    @Expose()
    fixerDate: Date;

    @ApiProperty()
    @IsOptional()
    @Expose()
    fixer: string; // account id

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

    @ApiProperty()
    @IsOptional()
    @Expose()
    fixer: string; // account id

  }

  export class TaskAssignFixerDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    fixer: string; // account id
  }
}
