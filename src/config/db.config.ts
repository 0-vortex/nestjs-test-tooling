import { registerAs } from '@nestjs/config';

export const DbConfig = registerAs('db', () => ({
  connection: String(process.env.TYPEORM_CONNECTION_API ?? 'postgres'),
  host: String(process.env.TYPEORM_HOST_API ?? 'localhost'),
  port: String(process.env.TYPEORM_PORT_API ?? '5432'),
  username: String(process.env.TYPEORM_USERNAME_API ?? 'postgres'),
  password: String(process.env.TYPEORM_PASSWORD_API ?? 'postgres'),
  database: String(process.env.TYPEORM_DATABASE_API ?? 'postgres'),
  maxQueryExecutionTime: Number(parseInt(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME_API ?? '10000', 10)),
}));

export default DbConfig;
