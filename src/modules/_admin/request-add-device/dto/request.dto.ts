import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestAddDeviceStatus } from 'src/entities/request_add_device';

export namespace RequestAddDeviceRequestDto {
  export class RequestAddDeviceCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: RequestAddDeviceStatus;
  
    @ApiProperty()
    @IsOptional()
    @Expose()
    created_by: string;
  
  }

  export class RequestAddDeviceUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    request: string;
    
    @ApiProperty()
    @IsOptional()
    @Expose()
    new_device

    @ApiProperty()
    @IsOptional()
    @Expose()
    status: RequestAddDeviceStatus;
  }
}
