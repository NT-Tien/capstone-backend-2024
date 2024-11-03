// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTGuard implements CanActivate {
  protected jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];
      if (!authorization) {
        return false;
      }
      const token = authorization.split(' ')[1];
      let user = this.jwtService.verify(token);
      request.headers.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
