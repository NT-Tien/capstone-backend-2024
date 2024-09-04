import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

export namespace TaskRequestDto {
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
