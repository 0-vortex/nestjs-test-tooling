import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ApiConfig from './config/api.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DbConfig from './config/db.config';
import { InjectDataSource, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseLoggerMiddleware from './common/middleware/database-logger.middleware';
import { DataSource } from 'typeorm';
import HttpLoggerMiddleware from './common/middleware/http-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ApiConfig, DbConfig],
      isGlobal: true,
    }),
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
  controllers: [AppController],
  providers: [AppService],
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
