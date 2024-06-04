import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as multipart from '@fastify/multipart';
import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AllExceptionsFilter } from './common/exceptions/catch.exception';
// import helmet from '@fastify/helmet'
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 10 * 1024 * 1024 }),
  );

  // upload file -----------------------------------
  app.register(multipart);

  // set up middlewares ----------------------------
  app.use(morgan('dev'));
  app.use(compression());
  // somewhere in your initialization file
  // await app.register(helmet,{
  //   contentSecurityPolicy: {
  //     directives: {
  //       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  //       'img-src': ["'self'", '*'], // Allow images to be loaded from any origin
  //     },
  //   },
  // })
  // -----------------------------------------------

  app.register(require('@fastify/cors'), {
    origin: [
      process.env.CORS_ORIGIN_FE1,
      process.env.CORS_ORIGIN_FE2,
      process.env.CORS_ORIGIN_FE3,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    preflightContinue: true,
  });
  // -----------------------------------------------

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  // set up swagger --------------------------------
  const config = new DocumentBuilder()
    .setTitle('Capstone 2024 - API - Documentation')
    .setDescription('API for user interface development')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
    },
  });
  // -----------------------------------------------

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
  });

  await app.listen(8080, '0.0.0.0');
}
bootstrap();