// lib/app.ts
import express from 'express';

import { Pengine } from './pengine';
import { FileSystemAdapter } from './FileSystemAdapter';

const app: express.Application = express();
const pengine = new Pengine({ adapter: new FileSystemAdapter() });

app.get('*', pengine.handle);

app.listen(56789, function() {
  console.log('Example app listening on port 3000!');
});
