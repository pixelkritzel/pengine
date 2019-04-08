import * as React from 'react';
import * as ReactDomServer from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Helmet, HelmetData } from 'react-helmet';
import marked from 'marked';
import fm from 'front-matter';
import { Request as IRequest, Response as IResponse, NextFunction as INextFunction } from 'express';

const generateHtml = (helmet: HelmetData, body: string) => `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            ${body}
        </body>
    </html>
`;

export function getFilePath(resource: string) {
  return `${process.cwd()}/data/${resource}`;
}

function testFileExists(path: string) {
  return fs.existsSync(path);
}

async function loadMarkdown(path: string) {
  const fileContent = await promisify(fs.readFile)(path, 'utf8');
  const { attributes: fmData, body: content } = fm(fileContent);
  return { fmData, content };
}

async function getSubContentFrontMatter(directoryPath: string) {
  const directoryContent = await promisify(fs.readdir)(directoryPath);

  const subPaths = directoryContent
    .map(name => path.join(directoryPath, name))
    .filter(testIsDirectory)
    .map(path => path + '/index.md')
    .filter(testFileExists);

  return Promise.all(subPaths.map(await loadMarkdown));
}

export async function load(resource: string) {
  const markdownPath = getFilePath(resource) + '/index.md';
  try {
    if (testFileExists(markdownPath)) {
      const { content, fmData } = await loadMarkdown(markdownPath);
      const subContentData = await getSubContentFrontMatter(getFilePath(resource));
      console.log(subContentData);
      const { layout = 'Default' } = fmData;
      const html = marked(content, { baseUrl: `/${resource}/` });
      const { default: Layout } = await import(`${process.cwd()}/theme/layouts/` + layout);
      const body = ReactDomServer.renderToStaticMarkup(<Layout content={html} />);
      const helmet = Helmet.renderStatic();
      return generateHtml(helmet, body);
    }
  } catch (e) {
    console.log(e);
  }
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
  const fsPath = getFilePath(resource);
  console.log(fsPath);
  const isDirectory = testIsDirectory(fsPath);
  if (isDirectory) {
    const response = await load(resource);
    res.send(response);
  } else {
    res.sendFile(fsPath);
  }
}
