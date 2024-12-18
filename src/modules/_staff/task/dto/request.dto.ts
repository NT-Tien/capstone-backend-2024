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
    autoClose?: string;
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

  export class FinishSendWarrantyDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    send_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    receive_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_receiverName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_receiverPhone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    send_note: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_address_1: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_address_2: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_address_ward: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_address_district: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    wc_address_city: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    send_bill_image: string[];
  }
}
