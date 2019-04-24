import * as fs from 'fs';
import { testFileExists } from './testFileExists';

export function testIsResourceDirectory(path: string) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory() && testFileExists(`${path}/index.md`);
  } catch (e) {
    console.log(e);
  }
}
