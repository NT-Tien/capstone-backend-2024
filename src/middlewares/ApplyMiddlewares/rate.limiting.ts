import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { redisClientLocal } from 'src/config/redis.client';

@Injectable()
export class RateLimiting implements NestMiddleware {
  client = redisClientLocal;
  amount = 10000;

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const ip = (req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress) as string;
    this.client.get(ip, (err: any, data: any) => {
      if (err) throw err;
      if (data) {
        const count = parseInt(data);
        if (count >= this.amount) {
          res.writeHead(429, {
            'Content-Type': 'application/json; charset=utf-8',
          });
          res.end(
            JSON.stringify({
              message: 'Too many requests, please try again later.',
            }),
          );
        } else {
          this.client.ttl(ip).then((ttl) => {
            if (ttl > 0) {
              this.client.set(ip, count + 1, 'EX', ttl);
            }
          });
          next();
        }
      } else {
        this.client.set(ip, 1, 'EX', 10);
        next();
      }
    });
  }
}
