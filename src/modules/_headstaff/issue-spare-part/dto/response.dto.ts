import { ApiProperty } from '@nestjs/swagger';

export namespace SparePartResponseDto {
  export class SparePartGetAll {
    @ApiProperty({
      example: [
        {
          id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
          createdAt: '2024-05-09T23:17:51.118Z',
          updatedAt: '2024-05-09T23:17:51.118Z',
          deletedAt: null,
          name: 'string',
          instruction: 'string',
          width: 0,
          height: 0,
        },
      ],
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class SparePartGetOne {
    @ApiProperty({
      example: {
        id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
        createdAt: '2024-05-09T23:17:51.118Z',
        updatedAt: '2024-05-09T23:17:51.118Z',
        deletedAt: null,
        name: 'string',
        instruction: 'string',
        width: 0,
        height: 0,
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class SparePartCreate {
    @ApiProperty({
      example: {
        name: 'string',
        instruction: 'string',
        width: 0,
        height: 0,
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
  export class SparePartUpdate {
    @ApiProperty({
      example: {
        name: 'string',
        instruction: 'string',
        width: 0,
        height: 0,
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
  export class SparePartDelete {
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
  export class SparePartRestore {
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
