import { IResourcePath } from './pengine';

interface IResourceData {
  layout: string;
  date: Date;
  published: boolean;

  [k: string]: unknown;
}

export class Resource {
  content: string;
  subResources: Resource[];
  data: IResourceData;
  resourcePath: string;

  constructor({
    content,
    data,
    resourcePath,
    subResources = []
  }: {
    content: string;
    data: IResourceData;
    resourcePath: IResourcePath;
    subResources?: Resource[];
  }) {
    this.content = content;
    this.data = data;
    this.resourcePath = resourcePath;
    this.subResources = subResources;
  }
}

export class ErrorMessage {
  message: string;
  statusCode: number;

  constructor(err: { statusCode: number; message: string }) {
    this.message = err.message;
    this.statusCode = err.statusCode;
  }
}

export abstract class DataAdapter {
  abstract async load(resource: IResourcePath): Promise<Resource | Buffer | ErrorMessage>;
}
