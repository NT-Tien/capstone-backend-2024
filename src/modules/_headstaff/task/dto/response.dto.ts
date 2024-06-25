import { ApiProperty } from '@nestjs/swagger';

export namespace TaskResponseDto {
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
  export class TaskGetOne {
    @ApiProperty({
      example: {
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
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class TaskCreate {
    @ApiProperty({
      example: {
        "request": {
          "id": "15ec8148-fa25-4827-91d7-45d29ed22eb2",
          "createdAt": "2024-06-19T17:41:32.168Z",
          "updatedAt": "2024-06-23T09:52:27.872Z",
          "deletedAt": null,
          "requester_note": "",
          "checker_note": "",
          "status": "PENDING",
          "type": "FIX",
          "level": null,
          "tasks": [],
          "device": {
            "id": "83a58ce1-d135-47a1-b15b-6175434668e7",
            "createdAt": "2024-06-19T11:57:12.111Z",
            "updatedAt": "2024-06-19T11:57:12.111Z",
            "deletedAt": null,
            "positionX": 13,
            "positionY": 13,
            "description": "tes",
            "operationStatus": 123
          }
        },
        "name": "43243242",
        "priority": true,
        "operator": 0,
        "totalTime": 0,
        "device": {
          "id": "83a58ce1-d135-47a1-b15b-6175434668e7",
          "createdAt": "2024-06-19T11:57:12.111Z",
          "updatedAt": "2024-06-19T11:57:12.111Z",
          "deletedAt": null,
          "positionX": 13,
          "positionY": 13,
          "description": "tes",
          "operationStatus": 123
        },
        "status": "AWAITING_FIXER",
        "fixerNote": null,
        "completedAt": null,
        "imagesVerify": [],
        "videosVerify": null,
        "id": "02130cbc-b525-4bc5-b239-5760734d57b8",
        "createdAt": "2024-06-23T09:55:12.049Z",
        "updatedAt": "2024-06-23T09:55:12.049Z",
        "deletedAt": null
      }
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 201 })
    statusCode: number;
  }
  export class TaskUpdate {
    @ApiProperty({
      example: {
        name: 'string',
        status: 'string',
        priority: true,
        operator: 0,
        totalTime: 0,
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
  export class TaskDelete {
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
  export class TaskRestore {
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
}
