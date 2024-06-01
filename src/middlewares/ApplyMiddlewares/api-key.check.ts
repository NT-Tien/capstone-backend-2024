// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { FastifyReply, FastifyRequest } from 'fastify';
// import * as dotenv from 'dotenv';
// dotenv.config();

// @Injectable()
// export class CheckApiKey implements NestMiddleware {
//   use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
//     const apiKey = req.headers['api-key'] as string;
//     if (apiKey === process.env.API_KEY) {
//       next();
//     } else {
//       res.writeHead(401, {
//         'Content-Type': 'application/json; charset=utf-8',
//       });
//       res.end(
//         JSON.stringify({
//           message: 'Unauthorized',
//         }),
//       );
//     }
//   }
// }
