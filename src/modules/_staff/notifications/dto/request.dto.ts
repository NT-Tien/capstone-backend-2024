import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { NotificationPriority } from 'src/entities/notification.entity';

export namespace NotificationsRequestDto {
  export class All_FilterQuery {
    @ApiPropertyOptional({
      enum: NotificationPriority,
    })
    @IsEnum(NotificationPriority)
    @IsOptional()
    @Expose()
    priority?: NotificationPriority;

    @ApiPropertyOptional({ type: 'boolean' })
    @IsOptional()
    @Expose()
    hasSeen?: string;
  }
}
