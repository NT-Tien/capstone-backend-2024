import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {

    constructor(
        private readonly jwtService: JwtService,
    ){}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Assuming the Authorization header format is "Bearer <token>"
            try {
                request.headers.user = this.jwtService.verify(token);// Attach the decoded token to the request object
            } catch (error) {
                throw new HttpException('Invalid token', 401);
            }
        }

        return next.handle();
    }
}
