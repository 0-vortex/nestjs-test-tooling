import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }), {
    bufferLogs: true,
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.enableCors();
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: String(major("1.8.0", { loose: false })),
  // });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(configService.get('api.port') ?? '3000', configService.get('api.host'));
}

void bootstrap();
