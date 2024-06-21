import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace IssueRequestDto {
  export class IssueCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    instruction: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    width: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    height: number;
  }

  export class IssueUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    name?: string;

    @ApiProperty()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    instruction?: string;

    @ApiProperty()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    width?: number;

    @ApiProperty()
    @IsNotEmpty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    height?: number;
  }
}
