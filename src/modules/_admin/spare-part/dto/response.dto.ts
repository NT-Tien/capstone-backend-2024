import { ApiProperty } from '@nestjs/swagger';

export namespace SparePartResponseDto {
  export class SparePartGetAll {
    @ApiProperty({
      example: [
        [
          {
            "id": "878d5057-484a-4e26-a374-28bbca00b0b7",
            "createdAt": "2024-06-19T12:05:04.228Z",
            "updatedAt": "2024-06-19T12:07:12.402Z",
            "deletedAt": null,
            "name": "Needle",
            "quantity": 100,
            "expirationDate": "2024-06-19",
            "machineModel": {
              "id": "c051c371-d7d9-4787-b85d-8882da43fece",
              "createdAt": "2024-06-19T11:27:13.690Z",
              "updatedAt": "2024-06-19T11:27:58.769Z",
              "deletedAt": null,
              "name": "Model Y",
              "description": "123123",
              "manufacturer": "Samsung",
              "yearOfProduction": 1000,
              "dateOfReceipt": "2024-06-12",
              "warrantyTerm": "2024-06-12"
            }
          }
        ],
        1
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
        "name": "Needle",
        "quantity": 100,
        "expirationDate": "2024-06-19"
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
        "name": "Needle",
        "quantity": 100,
        "expirationDate": "2024-06-19",
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
        "name": "Needle",
        "quantity": 100,
        "expirationDate": "2024-06-19",
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
