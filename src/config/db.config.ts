import { registerAs } from '@nestjs/config';

export interface IDbConfig {
  connection: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  maxQueryExecutionTime: number;
}

export const DbConfig = registerAs(
  'db',
  (): IDbConfig => ({
    // connection: String(process.env.TYPEORM_CONNECTION_API ?? 'postgres'),
    connection: String(process.env.TYPEORM_CONNECTION_API ?? 'cockroachdb'),
    host: String(process.env.TYPEORM_HOST_API ?? 'localhost'),
    // port: String(process.env.TYPEORM_PORT_API ?? '5432'),
    port: String(process.env.TYPEORM_PORT_API ?? '26257'),
    username: String(process.env.TYPEORM_USERNAME_API ?? 'root'),
    password: String(process.env.TYPEORM_PASSWORD_API ?? ''),
    database: String(process.env.TYPEORM_DATABASE_API ?? 'banking'),
    maxQueryExecutionTime: Number(parseInt(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME_API ?? '10000', 10)),
  }),
);

export default DbConfig;
