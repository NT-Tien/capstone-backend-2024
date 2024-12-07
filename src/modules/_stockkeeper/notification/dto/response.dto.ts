import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from 'src/entities/notification.entity';
import { TaskEntity } from 'src/entities/task.entity';

export namespace NotificationResponseDto {
  export class TaskGetAll {
    @ApiProperty({
      example: [
        {
          id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
          createdAt: '2024-05-09T23:17:51.118Z',
          updatedAt: '2024-05-09T23:17:51.118Z',
          deletedAt: null,
          name: 'string',
          status: 'string',
          priority: true,
          operator: 0,
          totalTime: 0,
        },
      ],
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class NotificationGetOne {
    @ApiProperty()
    notification: NotificationEntity;

    @ApiProperty()
    task?: TaskEntity;

    @ApiProperty()
    sparePartLacked?: number;
  }

  export class StockkeeperDashboard {
    @ApiProperty()
    sparepartNeedAdded: number;

    @ApiProperty()
    taskDeviceNotYet?: number;

    @ApiProperty()
    taskDeviceDone?: number;

    @ApiProperty()
    taskSparePartNotYet?: number;

    @ApiProperty()
    taskSparePartDone?: number;

    @ApiProperty()
    hotFixDevice?: number;
  }
}
