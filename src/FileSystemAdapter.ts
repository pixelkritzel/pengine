import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import fm from 'front-matter';
import marked from 'marked';

import { DataAdapter, IResourceResponse, IResponseTypes } from './DataAdapter';
import { IResourcePath } from './pengine';
import { updateDataDirectory } from './updateDataDirectory';
import { testFileExists } from './testFileExists';
import { testIsResourceDirectory } from './testIsResourceDirectory';
import { mergeDefaultFrontMatterData } from './mergeDefaultFrontmatterData';

import { config } from './config';

export function getFsPath(resourcePath: IResourcePath) {
  return path.resolve(`${config.dataDir}/${resourcePath}`);
}

async function loadMarkdown(resourcePath: IResourcePath): Promise<IResourceResponse> {
  const filePath = getFsPath(resourcePath + '/index.md');
  const directoryConfigPath = getFsPath(resourcePath + '/../config.json');
  let directoryConfig = {};
  if (testFileExists(directoryConfigPath)) {
    directoryConfig = await require(directoryConfigPath);
  }
  const fileContent = await promisify(fs.readFile)(filePath, 'utf8');
  const { attributes: fmData, body: content } = fm(fileContent);
  const html = marked(content, { baseUrl: `${resourcePath}/` });
  return {
    type: 'resource',
    data: { ...directoryConfig, ...mergeDefaultFrontMatterData(fmData, html) },
    content: html,
    resourcePath,
    subResources: await getSubResources(resourcePath)
  };
}

async function getSubResources(resourcePath: IResourcePath) {
  const directoryPath = getFsPath(resourcePath);
  const directoryContent = await promisify(fs.readdir)(directoryPath);

  const subPaths = directoryContent
    .filter(name => testIsResourceDirectory(path.join(directoryPath, name)))
    .map(directoryName => resourcePath + '/' + directoryName);

  return Promise.all(subPaths.map(await loadMarkdown));
}

export class FileSystemAdapter extends DataAdapter {
  constructor() {
    super();
    updateDataDirectory();
  }

  async load(resourcePath: IResourcePath): Promise<IResponseTypes> {
    const fsPath = getFsPath(resourcePath);
    try {
      if (testFileExists(fsPath)) {
        if (testIsResourceDirectory(fsPath)) {
          try {
            const result = await loadMarkdown(resourcePath);

            return result;
          } catch (e) {
            console.log(e); // tslint:disable-line:no-console
          }
        } else {
          const buffer = await promisify(fs.readFile)(fsPath);
          if (buffer) {
            return {
              type: 'buffer',
              buffer
            };
          }
        }
      }
    } catch (e) {
      console.log(e); // tslint:disable-line:no-console
    }
    return { type: 'error', statusCode: 404, message: 'File not found' };
  }
}
