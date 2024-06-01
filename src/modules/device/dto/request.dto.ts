import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace DeviceRequestDto {
  export class DeviceCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    position: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    machineModel: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    operationStatus: number;
  }

  export class DeviceUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.position)
    @Expose()
    position: string;

    @ApiProperty()
    @ValidateIf((o) => o.machineModel)
    @Expose()
    machineModel: string;

    @ApiProperty()
    @ValidateIf((o) => o.description)
    @Expose()
    description: string;

    @ApiProperty()
    @ValidateIf((o) => o.status)
    @Expose()
    status: boolean;

    @ApiProperty()
    @ValidateIf((o) => o.operationStatus)
    @Expose()
    operationStatus: number;
  }
}
