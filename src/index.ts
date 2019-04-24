// lib/app.ts
import express from 'express';
import dotenv from 'dotenv';

import { Pengine } from './pengine';
import { FileSystemAdapter } from './FileSystemAdapter';

dotenv.config();

const app: express.Application = express();
const pengine = new Pengine({ adapter: new FileSystemAdapter() });

app.get('*', pengine.handle);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
