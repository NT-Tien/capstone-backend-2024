import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Assuming the Authorization header format is "Bearer <token>"
            console.log('token', token);
            
            try {
                request.headers.user = jwt.decode(token);; // Attach the decoded token to the request object
            } catch (error) {
                throw new HttpException('Invalid token', 401);
            }
        }

        return next.handle();
    }
}
