import * as React from 'react';
import * as ReactDomServer from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Helmet, HelmetData } from 'react-helmet';
import marked from 'marked';
import fm from 'front-matter';
import { Request as IRequest, Response as IResponse, NextFunction as INextFunction } from 'express';
import * as nodeSass from 'node-sass';

const generateHtml = (helmet: HelmetData, body: string) => `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <link rel="stylesheet" href="style.css">
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            ${body}
        </body>
    </html>
`;

type IResource = string;

export function getFilePath(resourcePath: IResource) {
  return path.resolve(`${process.cwd()}/data/${resourcePath}`);
}

function testFileExists(path: string) {
  return fs.existsSync(path);
}

async function loadMarkdown(resourcePath: IResource) {
  const filePath = getFilePath(resourcePath + '/index.md');
  const directoryConfigPath = getFilePath(resourcePath + '/../config.json');
  let directoryConfig = {};
  if (testFileExists(directoryConfigPath)) {
    directoryConfig = await require(directoryConfigPath);
  }
  const fileContent = await promisify(fs.readFile)(filePath, 'utf8');
  const { attributes: fmData, body: content } = fm(fileContent);
  return {
    data: { ...directoryConfig, ...fmData },
    content: marked(content, { baseUrl: `/${resourcePath}/` }),
    resourcePath
  };
}

async function getSubResources(resourcePath: IResource) {
  const directoryPath = getFilePath(resourcePath);
  const directoryContent = await promisify(fs.readdir)(directoryPath);

  const subPaths = directoryContent
    .filter(name => testIsDirectory(path.join(directoryPath, name)))
    .map(path => resourcePath + '/' + path);

  return Promise.all(subPaths.map(await loadMarkdown));
}

export async function load(resource: IResource) {
  const { content, data } = await loadMarkdown(resource);
  const subResources = await getSubResources(resource);
  const { layout = 'Default' } = data;
  const props = { content, subResources, data };
  const { default: Layout } = await import(`${process.cwd()}/theme/layouts/` + layout);
  const body = ReactDomServer.renderToStaticMarkup(<Layout {...props} />);
  const helmet = Helmet.renderStatic();
  return generateHtml(helmet, body);
}

function testIsDirectory(path: string) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (e) {
    console.log(e);
  }
}

export async function pengine(req: IRequest, res: IResponse, next: INextFunction) {
  const { path } = req;
  const resource = path.substring(1, path.length);
  if (resource === 'style.css') {
    const { css } = await promisify(nodeSass.render)({ file: `${process.cwd()}/theme/scss/style.scss` });
    res.type('text/css');
    res.send(css.toString());
    next();
  }
  const fsPath = getFilePath(resource);
  if (testFileExists(fsPath)) {
    const isDirectory = testIsDirectory(fsPath);
    if (isDirectory) {
      const response = await load(resource);
      res.send(response);
    } else {
      res.sendFile(fsPath);
    }
  } else {
    res.statusCode = 404;
    next();
  }
}
