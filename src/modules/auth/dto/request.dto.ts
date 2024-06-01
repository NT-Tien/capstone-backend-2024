import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';

export namespace AuthRequestDto {
  export class LoginLocalDataDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
  }

  export class PasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;
  }

  export class PayloadTokenDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    role: string;
    exp?: any;
  }

  export class PhoneDto {
    @ApiProperty()
    @IsPhoneNumber()
    @IsString()
    @IsNotEmpty()
    value: string;
  }

  export class RegisterDataDto extends BaseDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    @Expose()
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;
  }

}
