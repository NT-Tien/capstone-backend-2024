import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace IssueRequestDto {
  export class IssueCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;

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

  }

  export class IssueUpdateDto extends BaseDTO {

    @ApiProperty()
    @IsOptional()
    @Expose()
    task?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    typeError?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    fixType?: string;
  }
}

export namespace IssueSparePartRequestDto {
  export class IssueSparePartCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    issue: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    sparePart: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;
  }

  export class IssueSparePartUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    issue?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    sparePart?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    quantity?: number;
  }
}
