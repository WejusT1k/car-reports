import { DataSource } from 'typeorm';
import { dbConfig } from './ormconfig';

const source = new DataSource(dbConfig);

export default source;
