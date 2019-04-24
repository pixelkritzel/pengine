import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import fm from 'front-matter';
import marked from 'marked';

import { DataAdapter, ErrorMessage, Resource } from './DataAdapter';
import { IResourcePath } from './pengine';
import { updateDataDirectory } from './updateDataDirectory';
import { testFileExists } from './testFileExists';
import { testIsResourceDirectory } from './testIsResourceDirectory';

import { config } from './config';

export function getFsPath(resourcePath: IResourcePath) {
  return path.resolve(`${config.dataDir}/${resourcePath}`);
}

async function loadMarkdown(resourcePath: IResourcePath): Promise<Resource> {
  const filePath = getFsPath(resourcePath + '/index.md');
  const directoryConfigPath = getFsPath(resourcePath + '/../config.json');
  let directoryConfig = {};
  if (testFileExists(directoryConfigPath)) {
    directoryConfig = await require(directoryConfigPath);
  }
  const fileContent = await promisify(fs.readFile)(filePath, 'utf8');
  const { attributes: fmData, body: content } = fm(fileContent);
  return new Resource({
    data: { ...directoryConfig, ...fmData },
    content: marked(content, { baseUrl: `${resourcePath}/` }),
    resourcePath,
    subResources: await getSubResources(resourcePath)
  });
}

async function getSubResources(resourcePath: IResourcePath) {
  const directoryPath = getFsPath(resourcePath);
  const directoryContent = await promisify(fs.readdir)(directoryPath);

  const subPaths = directoryContent
    .filter(name => testIsResourceDirectory(path.join(directoryPath, name)))
    .map(path => resourcePath + '/' + path);

  return Promise.all(subPaths.map(await loadMarkdown));
}

export class FileSystemAdapter extends DataAdapter {
  constructor() {
    super();
    updateDataDirectory();
  }

  async load(resourcePath: IResourcePath) {
    const fsPath = getFsPath(resourcePath);
    try {
      if (testFileExists(fsPath)) {
        if (testIsResourceDirectory(fsPath)) {
          try {
            const result = await loadMarkdown(resourcePath);

            return result;
          } catch (e) {
            console.log(e);
          }
        } else {
          const fileBuffer = await promisify(fs.readFile)(fsPath);
          if (fileBuffer) {
            return fileBuffer;
          }
        }
      }
    } catch (e) {}
    return new ErrorMessage({ statusCode: 404, message: 'File not found' });
  }
}
