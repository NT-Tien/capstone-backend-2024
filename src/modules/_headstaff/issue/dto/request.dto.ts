/* eslint-disable @typescript-eslint/no-namespace */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
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

  export class IssueCreateManyDto extends BaseDTO {
    @ApiProperty({ type: [IssueCreateOneDto] })
    @IsArray()
    @IsNotEmpty()
    @Expose()
    issues: IssueCreateOneDto[];

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;
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
    @ApiProperty()
    @IsOptional()
    @Expose()
    imagesVerify?: string[];


    @ApiProperty()
    @IsOptional()
    @Expose()
    videosVerify?: string;
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
