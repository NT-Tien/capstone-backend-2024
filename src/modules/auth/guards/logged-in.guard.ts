import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTGuard } from './jwt.guard';

@Injectable()
export class LoggedInGuard extends JWTGuard implements CanActivate {
  constructor(protected readonly jwtService: JwtService) {
    super(jwtService);
  }
  canActivate(context: ExecutionContext): boolean {
    if (!super.canActivate(context)) {
      return false;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const user = request?.headers?.user as any;
      if (user) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }
}
