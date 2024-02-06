import { DataSourceOptions } from 'typeorm';

const ENV_NAME = process.env.NODE_ENV;

const dbConfig = {
  synchronize: false,
  migrations: ['dist/migrations/*.js']
} as DataSourceOptions;

switch (ENV_NAME) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js']
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true
    });
    break;
  case 'production':
    Object.assign<DataSourceOptions, Partial<DataSourceOptions>>(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['../*.entity.js'],
      ssl: {
        rejectUnauthorized: false
      }
    });
    break;
  default:
    throw new Error('unknown environment');
}

export { dbConfig };
