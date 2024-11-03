import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from '../../../../common/base/dto.base';

export namespace IssueRequestDto {
  export class ResolveIssue extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    imagesVerify: string[];

    @ApiProperty()
    @IsOptional()
    @Expose()
    videosVerify?: string;
  }

  export class FailIssue extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    failReason: string;
  }
}
