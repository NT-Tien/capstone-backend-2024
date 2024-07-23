import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace FeedbackRequestDto {
  export class FeedbackCreateDto extends BaseDTO {

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    requester: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    content: string;
    
  }

  export class FeedbackUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    request: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    requester: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    content: string;
  }
}
