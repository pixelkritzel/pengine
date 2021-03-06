// lib/app.ts
import express from 'express';

import { Pengine } from './pengine';
import { FileSystemAdapter } from './FileSystemAdapter';

const app: express.Application = express();
const pengine = new Pengine({ adapter: new FileSystemAdapter() });

app.all('*', pengine.handle);

app.listen(56789, function() {
  console.log('Example app listening on port 56789!'); // tslint:disable-line:no-console
});
