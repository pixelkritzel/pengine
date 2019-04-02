// lib/app.ts
import express from 'express';

import { pengine } from './load';

// Create a new express application instance
const app: express.Application = express();

app.get('*', pengine);

/*
app.get('/blog/:slug:/:resource', function(req, res, next) {
  console.log('resource');
  console.log(getFilePath(`blog/${req.params.slug}/${req.params.resource}`));
  res.sendFile(getFilePath(`blog/${req.params.slug}/${req.params.resource}`));
});

app.get('/blog/:slug', async function(req, res) {
  console.log('blog post');
  const response = await load(`blog/${req.params.slug}`);
  res.send(response);
});
*/
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
