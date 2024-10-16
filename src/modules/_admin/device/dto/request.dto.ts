import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace DeviceRequestDto {
  export class DeviceFilterDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    areaId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    machineModelId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    positionX?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    positionY?: number;
  }

  export class DeviceOrderDto extends BaseDTO {
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    @Expose()
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
      enum: ['createdAt', 'updatedAt', 'position'],
    })
    @IsOptional()
    @IsEnum(['createdAt', 'updatedAt', 'position'])
    @Expose()
    orderBy?: 'createdAt' | 'updatedAt' | 'position';
  }

  export class DeviceCreateDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    area: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    positionX: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    positionY: number;

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
    operationStatus: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    status?: boolean;
  }

  export class DeviceUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.area)
    @Expose()
    area: string;

    @ApiProperty()
    @ValidateIf((o) => o.positionX)
    @Expose()
    positionX: number;

    @ApiProperty()
    @ValidateIf((o) => o.positionY)
    @Expose()
    positionY: number;

    @ApiProperty()
    @ValidateIf((o) => o.machineModel)
    @Expose()
    machineModel: string;

    @ApiProperty()
    @ValidateIf((o) => o.description)
    @Expose()
    description: string;

    @ApiProperty()
    @ValidateIf((o) => o.operationStatus)
    @Expose()
    operationStatus: number;

    @ApiProperty()
    @ValidateIf((o) => o.status)
    @Expose()
    status: boolean;
  }
}
