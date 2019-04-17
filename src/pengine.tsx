import * as React from 'react';
import * as ReactDomServer from 'react-dom/server';

import { promisify } from 'util';
import { Helmet, HelmetData } from 'react-helmet';

import { Request, Response, NextFunction } from 'express';
import * as nodeSass from 'node-sass';
import { FileSystemAdapter } from './FileSystemAdapter';
import { Resource, ErrorMessage, DataAdapter } from './DataAdapter';

const generateHtml = (helmet: HelmetData, body: string) => `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <link rel="stylesheet" href="/style.css">
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            ${body}
        </body>
    </html>
`;

export type IResourcePath = string;

export class Pengine {
  adapter: DataAdapter;

  constructor({ adapter }: { adapter: DataAdapter }) {
    this.adapter = adapter;
  }

  getResponse = async (resource: IResourcePath): Promise<{ body: string | Buffer; statusCode: number }> => {
    const result = await this.adapter.load(resource);
    if (result instanceof Resource) {
      // continue with markdown conversion
      const { layout = 'Default' } = result.data;
      const { default: Layout } = await import(`${process.cwd()}/theme/layouts/` + layout);
      const body = ReactDomServer.renderToStaticMarkup(<Layout {...result} />);
      const helmet = Helmet.renderStatic();
      return { body: generateHtml(helmet, body), statusCode: 200 };
    }
    if (result instanceof Buffer) {
      return { statusCode: 200, body: result };
    }
    if (result instanceof ErrorMessage) {
      const { default: ErrorPage } = await import(`${process.cwd()}/theme/layouts/Error`);
      const body = ReactDomServer.renderToStaticMarkup(<ErrorPage {...result} />);
      const helmet = Helmet.renderStatic();
      return { body: generateHtml(helmet, body), statusCode: result.statusCode };
    }
    return { statusCode: 500, body: 'This should not have happened' };
  };

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { path: resourcePath } = req;
    if (resourcePath === '/style.css') {
      const { css } = await promisify(nodeSass.render)({ file: `${process.cwd()}/theme/scss/style.scss` });
      res.type('text/css');
      res.send(css.toString());
      next();
    } else {
      const { body, statusCode } = await this.getResponse(resourcePath);
      res.statusCode = statusCode;
      res.send(body);
    }
  };
}
