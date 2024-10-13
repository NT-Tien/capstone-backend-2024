import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export namespace SimulationRequest_RequestDto {
  export class GenerateRandomRequest {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Expose()
    count: number;
  }
}
