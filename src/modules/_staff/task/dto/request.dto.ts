import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace TaskRequestDto {

  export class TaskAllCount extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    month: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    year: number;
  }

  export class TaskAllByDate extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    start_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    end_date: string;
  }

  export class TaskCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    machineModel: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    expirationDate: Date;
  }

  export class TaskCompleteQuery extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    autoClose?: string
  }

  export class TaskUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    machineModel: string;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    name: string;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    quantity: number;

    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @Expose()
    expirationDate: Date;
  }

  export class TaskConfirmDoneDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    fixerNote: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    imagesVerify: string[];

    @ApiProperty()
    @IsOptional()
    @Expose()
    videosVerify: string;
  }
}
