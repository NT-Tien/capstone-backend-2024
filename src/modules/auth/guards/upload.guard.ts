// auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
  } from '@nestjs/common';
import { Role } from 'src/entities/account.entity';
  
  @Injectable()
  export class UploadGuard implements CanActivate {
  
    private readonly logger = new Logger(UploadGuard.name);
  
    canActivate(context: ExecutionContext): boolean {
      try {
        const request = context.switchToHttp().getRequest();
        const user = request.headers['user'];
        const handler = context.getHandler();
        const controller = context.getClass();
        const endpoint = `${controller.name}.${handler.name}`;
        this.logger.log(`Accessing endpoint: ${endpoint}`);
        if (user?.role !== Role.admin && user?.role !== Role.staff) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    }
  }
  