import { RequestRequestDto } from 'src/modules/_head/request/dto/request.dto';

export namespace SimulationRequest_ResponseDto {
  export class GenerateRandomRequest {
    requests: (RequestRequestDto.RequestCreateDto & {
      token: string;
    })[];
  }
}
