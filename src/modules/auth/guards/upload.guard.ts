// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/entities/account.entity';

@Injectable()
export class UploadGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming the Authorization header format is "Bearer <token>"
        let user = this.jwtService.verify(token);// Attach the decoded token to the request objectoobjecto
        if (user?.role !== Role.admin && user?.role !== Role.staff) {
          request.headers.user = user;
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
