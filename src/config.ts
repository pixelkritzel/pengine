import * as dotenv from 'dotenv';
import { testFileExists } from './testFileExists';
dotenv.config();

const { DATA_DIR, UPDATE_RESOURCE, UPDATE_SECRET } = process.env;

if (!DATA_DIR || !testFileExists(DATA_DIR)) {
  console.error('Environment DATA_DIRECTORY is not set!');
  process.exit(1);
}

const DEFAULTS = {
  updateResource: '/update',
  updateSecret: undefined
};

const config = {
  ...DEFAULTS,
  dataDir: DATA_DIR,
  updateSecret: UPDATE_SECRET
};

if (UPDATE_RESOURCE) {
  config.updateResource = UPDATE_RESOURCE;
}

export { config };
