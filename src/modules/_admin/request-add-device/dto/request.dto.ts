import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

// @ManyToOne(() => TaskEntity, (task) => task.request)
// task: TaskEntity;

// @Column({ type: 'enum', enum: RequestAddDeviceStatus, default: RequestAddDeviceStatus.PENDING })
// status: RequestAddDeviceStatus;

export namespace RequestAddDeviceRequestDto {
  export class RequestAddDeviceCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    task: string;

    @ApiProperty()
    @IsNotEmpty()
    status: string;
  }

  export class RequestAddDeviceUpdateDto extends BaseDTO {
    @ApiProperty()
    @ValidateIf((o) => o.task !== undefined)
    @Expose()
    task: string;

    @ApiProperty()
    @ValidateIf((o) => o.status !== undefined)
    @Expose()
    status: string;
  }
}
