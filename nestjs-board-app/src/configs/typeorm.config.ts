import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'node:process';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'study',
  password: process.env.DB_PASSWORD,
  database: 'study',
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  synchronize: true,
};
