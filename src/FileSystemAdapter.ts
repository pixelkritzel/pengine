import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import fm from 'front-matter';
import marked from 'marked';

import { DataAdapter, ErrorMessage, Resource } from './DataAdapter';
import { IResourcePath } from './pengine';

export function getFsPath(resourcePath: IResourcePath) {
  return path.resolve(`${process.cwd()}/data/${resourcePath}`);
}

function testFileExists(path: string) {
  return fs.existsSync(path);
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
    .filter(name => testIsDirectory(path.join(directoryPath, name)))
    .map(path => resourcePath + '/' + path);

  return Promise.all(subPaths.map(await loadMarkdown));
}

function testIsDirectory(path: string) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (e) {
    console.log(e);
  }
}

export class FileSystemAdapter extends DataAdapter {
  async load(resourcePath: IResourcePath) {
    const fsPath = getFsPath(resourcePath);
    try {
      if (testFileExists(fsPath)) {
        if (testIsDirectory(fsPath)) {
          const result = await loadMarkdown(resourcePath);
          return result;
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
