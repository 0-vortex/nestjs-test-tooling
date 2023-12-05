import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import ApiConfig from './config/api.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DbConfig from './config/db.config';
import { InjectDataSource, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseLoggerMiddleware from './common/middleware/database-logger.middleware';
import { DataSource } from 'typeorm';
import HttpLoggerMiddleware from './common/middleware/http-logger.middleware';
import { LoggerModule } from 'nestjs-pino';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ApiConfig, DbConfig],
      isGlobal: true,
    }),
    HealthModule,
    HelloModule,
    HttpModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          name: `api`,
          level: config.get('api.logging'),
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'UTC:hh:MM:ss.l',
              singleLine: true,
              messageFormat: `${clc.yellow(`[{context}]`)} ${clc.green(`{msg}`)}`,
              ignore: 'pid,hostname,context',
            },
          },
          customProps: () => ({ context: 'HTTP' }),
        },
        exclude: [{ method: RequestMethod.ALL, path: 'check' }],
      }),
    }),
    TerminusModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'DbConnection',
      useFactory: (configService: ConfigService) =>
        ({
          parseInt8: true,
          type: configService.get('db.connection'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          autoLoadEntities: false,
          entities: [],
          synchronize: false,
          logger: new DatabaseLoggerMiddleware('DB'),
          maxQueryExecutionTime: configService.get('db.maxQueryExecutionTime'),
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    @InjectDataSource('DbConnection')
    private readonly dbConnection: DataSource,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
