// lib/app.ts
import express from 'express';

import { pengine } from './pengine';

const app: express.Application = express();

app.get('*', pengine);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
