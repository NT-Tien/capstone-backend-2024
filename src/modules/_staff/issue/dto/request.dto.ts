import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from '../../../../common/base/dto.base';

export namespace IssueRequestDto {
  export class ResolveIssue extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    imagesVerify: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    videosVerify?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    resolvedNote?: string
  }

  export class FailIssue extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    failReason: string;
  }
  export class FailIssueWarranty extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    failReason: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    taskId: string

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    imagesVerify?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    shouldSkipUpdateTask?: boolean;
  }
}
