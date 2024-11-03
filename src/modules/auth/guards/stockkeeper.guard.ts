import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/entities/account.entity';

@Injectable()
export class StockkeeperGuard extends JWTGuard implements CanActivate {
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
      if (user && user.role === Role.stockkeeper) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }
}
