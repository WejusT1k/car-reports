import { rm } from 'fs/promises';
import { join } from 'path';

global.afterEach(async () => {
  await rm(join(__dirname, '..', 'test.sqlite'));
});
