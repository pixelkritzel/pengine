import * as fs from 'fs';

export function testFileExists(path: string) {
  return fs.existsSync(path);
}
