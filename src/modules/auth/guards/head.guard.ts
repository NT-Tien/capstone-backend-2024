import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class HeadGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE_TIENNT') private readonly AuthService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      console.log('request', request);
      const accessToken = (request?.headers?.authorization as string)?.split(
        ' ',
      )[1];
      const response = await this.AuthService.verifyHeadToken(accessToken);
      if (response) {
        return true;
      } else return false;
    } catch (error) {
      console.log('error', error);
      
      return false;
    }
  }
}
