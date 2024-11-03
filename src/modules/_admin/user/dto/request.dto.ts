import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDTO } from 'src/common/base/dto.base';
import { Role } from 'src/entities/account.entity';

export namespace UserRequestDto {
    export class UserCreateDto extends BaseDTO {

        @ApiProperty()
        @Expose()
        username: string;

        @ApiProperty()
        @Expose()
        phone: string;

        @ApiProperty()
        @Expose()
        password: string;

        @ApiProperty()
        @Expose()
        role: Role;
    }

    export class UserUpdateDto extends UserCreateDto { }
}
