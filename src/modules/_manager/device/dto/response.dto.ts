import { ApiProperty } from '@nestjs/swagger';

export namespace DeviceResponseDto {
  export class DeviceGetAll {
    @ApiProperty({
      example: [
        {
          id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
          createdAt: '2024-05-09T23:17:51.118Z',
          updatedAt: '2024-05-09T23:17:51.118Z',
          deletedAt: null,
          area: 'string',
          positionX: 0,
          positionY: 0,
          machineModel: 'string',
          description: 'string',
          status: true,
          operationStatus: 0,
        },
      ],
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class DeviceGetOne {
    @ApiProperty({
      example: {
        id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
        createdAt: '2024-05-09T23:17:51.118Z',
        updatedAt: '2024-05-09T23:17:51.118Z',
        deletedAt: null,
        area: 'string',
        positionX: 0,
        positionY: 0,
        machineModel: 'string',
        description: 'string',
        status: true,
        operationStatus: 0,
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class DeviceCreate {
    @ApiProperty({
      example: {
        area: 'string',
        positionX: 0,
        positionY: 0,
        machineModel: 'string',
        description: 'string',
        status: true,
        operationStatus: 0,
        deletedAt: null,
        id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
        createdAt: '2024-05-09T23:17:51.118Z',
        updatedAt: '2024-05-09T23:17:51.118Z',
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 201 })
    statusCode: number;
  }
  export class DeviceUpdate {
    @ApiProperty({
      example: {
        area: 'string',
        positionX: 0,
        positionY: 0,
        machineModel: 'string',
        description: 'string',
        status: true,
        operationStatus: 0,
        deletedAt: null,
        id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
        createdAt: '2024-05-09T23:17:51.118Z',
        updatedAt: '2024-05-09T23:17:51.118Z',
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class DeviceDelete {
    @ApiProperty({
      example: {
        generatedMaps: [],
        raw: [],
        affected: 1,
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class DeviceRestore {
    @ApiProperty({
      example: {
        generatedMaps: [],
        raw: [],
        affected: 1,
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class ForcastResponseDto {
    @ApiProperty()
    machineId: string;

    @ApiProperty()
    isOk: boolean;
  }
}
