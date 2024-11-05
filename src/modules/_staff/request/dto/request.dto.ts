import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export namespace RequestDto {
  export class RequestUpdateWarrantyDate {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    warrantyDate: string;
  }
}
