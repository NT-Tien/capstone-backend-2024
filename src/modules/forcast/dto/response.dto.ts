import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/common/base/dto.base';
import { v4 as uuidv4 } from 'uuid';

export namespace AuthResponseDto {
  export class RegisterResponseDto {
    @ApiProperty({
      example: {
        username: 'user',
        phone: '+84999999999',
        deletedAt: null,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
      },
      nullable: true,
    })
    data: object;

    @ApiProperty({
      example: 'Success',
    })
    message: string;

    @ApiProperty({
      example: 201,
    })
    statusCode: number;
  }
  export class LoginResponseDto {
    @ApiProperty({
      example: 'JWT Token',
    })
    data: string;

    @ApiProperty({
      example: 'Success',
    })
    message: string;

    @ApiProperty({
      example: 200,
    })
    statusCode: number;
  }
  class payloadGetAccountResponseDtoData {
    @ApiProperty({
      example: 'user',
    })
    role: string;
    @ApiProperty({
      example: 'user',
    })
    username: string;
    @ApiProperty({
      example: '+84999999999',
    })
    phone: string;
    @ApiProperty({
      example: null,
    })
    deletedAt: Date;
    @ApiProperty({
      example: uuidv4(),
    })
    id: string;
    @ApiProperty({
      example: new Date(),
    })
    createdAt: Date;
    @ApiProperty({
      example: new Date(),
    })
    updatedAt: Date;
  }
  export class GetAccountResponseDto extends BaseDTO {
    @ApiProperty({
      type: [payloadGetAccountResponseDtoData],
      nullable: true,
    })
    data: object;

    @ApiProperty({
      example: 'Success',
    })
    message: string;

    @ApiProperty({
      example: 200,
    })
    statusCode: number;
  }
  export class UpdateAccountResponseDto {
    @ApiProperty({
      example: {
        generatedMaps: [],
        raw: [],
        affected: 1,
      },
      nullable: true,
    })
    data: object;

    @ApiProperty({
      example: 'Success',
    })
    message: string;

    @ApiProperty({
      example: 200,
    })
    statusCode: number;
  }
}
