/* tslint:disable:max-classes-per-file */

import { IResourcePath } from './pengine';

export interface IResourceData {
  layout: string;
  date: Date;
  draft: boolean;
  title: string;

  [k: string]: unknown;
}

export type IResourceResponse = {
  type: 'resource';
  content: string;
  subResources: IResourceResponse[];
  data: IResourceData;
  resourcePath: string;
};

export type IErrorResponse = {
  type: 'error';
  message: string;
  statusCode: number;
};

export type IBufferResponse = {
  type: 'buffer';
  buffer: Buffer;
};

export type IResponseTypes = IResourceResponse | IErrorResponse | IBufferResponse;

export abstract class DataAdapter {
  abstract async load(resource: IResourcePath): Promise<IResponseTypes>;
}
