import { ApiProperty } from '@nestjs/swagger';

export namespace MachineModelResponseDto {
  export class MachineModelGetAll {
    @ApiProperty({
      example: [
        {
          id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
          createdAt: '2024-05-09T23:17:51.118Z',
          updatedAt: '2024-05-09T23:17:51.118Z',
          deletedAt: null,
          name: 'string',
          description: 'string',
          origin: 'string',
          manufacturer: 'string',
          yearOfProduction: 0,
          dateOfReceipt: '2024-05-09T23:17:51.118Z',
          warrantyTerm: '2024-05-09T23:17:51.118Z',
        },
      ],
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class MachineModelGetOne {
    @ApiProperty({
      example: {
        id: 'b7ac4bf9-3830-4bb4-8618-58ff02be0a7e',
        createdAt: '2024-05-09T23:17:51.118Z',
        updatedAt: '2024-05-09T23:17:51.118Z',
        deletedAt: null,
        name: 'string',
        description: 'string',
        origin: 'string',
        manufacturer: 'string',
        yearOfProduction: 0,
        dateOfReceipt: '2024-05-09T23:17:51.118Z',
        warrantyTerm: '2024-05-09T23:17:51.118Z',
      },
    })
    data: object;
    @ApiProperty({ example: 'Success' })
    message: string;
    @ApiProperty({ example: 200 })
    statusCode: number;
  }
  export class MachineModelCreate {
    @ApiProperty({
      example: {
        name: 'string',
        description: 'string',
        origin: 'string',
        manufacturer: 'string',
        yearOfProduction: 0,
        dateOfReceipt: '2024-05-09T23:17:51.118Z',
        warrantyTerm: '2024-05-09T23:17:51.118Z',
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
  export class MachineModelUpdate {
    @ApiProperty({
      example: {
        name: 'string',
        description: 'string',
        origin: 'string',
        manufacturer: 'string',
        yearOfProduction: 0,
        dateOfReceipt: '2024-05-09T23:17:51.118Z',
        warrantyTerm: '2024-05-09T23:17:51.118Z',
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
  export class MachineModelDelete {
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
  export class MachineModelRestore {
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
