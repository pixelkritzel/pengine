import * as shelljs from 'shelljs';

import { config } from './config';

export function updateDataDirectory() {
  const pwd = shelljs.pwd();
  shelljs.cd(config.dataDir);
  shelljs.exec(`git pull`);
  shelljs.cd(pwd);
}
