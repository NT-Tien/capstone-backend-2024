import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { FeedbackRating } from 'src/entities/feedback.entity';
import { RequestStatus } from 'src/entities/request.entity';

export namespace RequestRequestDto {
  export class RequestFeedbackDto extends BaseDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    content: string;

    @ApiProperty({ enum: FeedbackRating })
    @IsNotEmpty()
    @Expose()
    rating: FeedbackRating;
  }
  export class RequestAddFeedbackDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    content: string;
  }
  export class RequestCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    device: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    requester_note: string;
  }

  export class RequestUpdateDto extends BaseDTO {
    // @ApiProperty()
    // @ValidateIf((o) => o.task)
    // @Expose()
    // task?: string;

    @ApiProperty()
    @ValidateIf((o) => o.requester_note)
    @Expose()
    requester_note?: string;

    @ApiProperty()
    @ValidateIf((o) => o.status)
    @Expose()
    status?: RequestStatus;
  }
}
