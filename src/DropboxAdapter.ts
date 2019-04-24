import fetch from 'isomorphic-fetch';

import { Dropbox } from 'dropbox';

import fm from 'front-matter';
import marked from 'marked';

import { DataAdapter, ErrorMessage, Resource } from './DataAdapter';
import { IResourcePath } from './pengine';

// async function loadMarkdown(resourcePath: IResourcePath): Promise<Resource> {
//   const filePath = getFsPath(resourcePath + '/index.md');
//   const directoryConfigPath = getFsPath(resourcePath + '/../config.json');
//   let directoryConfig = {};
//   if (testFileExists(directoryConfigPath)) {
//     directoryConfig = await require(directoryConfigPath);
//   }
//   const fileContent = await promisify(fs.readFile)(filePath, 'utf8');
//   const { attributes: fmData, body: content } = fm(fileContent);
//   return new Resource({
//     data: { ...directoryConfig, ...fmData },
//     content: marked(content, { baseUrl: `${resourcePath}/` }),
//     resourcePath,
//     subResources: await getSubResources(resourcePath)
//   });
// }

// async function getSubResources(resourcePath: IResourcePath) {
//   const directoryPath = getFsPath(resourcePath);
//   const directoryContent = await promisify(fs.readdir)(directoryPath);

//   const subPaths = directoryContent
//     .filter(name => testIsDirectory(path.join(directoryPath, name)))
//     .map(path => resourcePath + '/' + path);

//   return Promise.all(subPaths.map(await loadMarkdown));
// }

// function testIsDirectory(path: string) {
//   try {
//     const stats = fs.statSync(path);
//     return stats.isDirectory();
//   } catch (e) {
//     console.log(e);
//   }
// }

interface IDropboxFilesDownloadResult extends DropboxTypes.files.FileMetadata {
  fileBinary: Buffer;
}

export class DropboxAdapter extends DataAdapter {
  dropbox: Dropbox;

  constructor({ DROPBOX_KEY }: { DROPBOX_KEY: string }) {
    super();
    this.dropbox = new Dropbox({
      fetch: fetch,
      accessToken: DROPBOX_KEY
    });
    this.filstFiles();

    // .filesListFolder({ path: '/blog' })
    //   // .filesDownload({
    //   //   path: '/index.md',
    //   //   rev: '01d000000013c28fff0'
    //   // })
    //   // .then((data: any) => console.log(data.fileBinary.toString()), console.error);
    //   .then(console.log);

    // new Dropbox({
    //   fetch: fetch,
    //   accessToken: process.env.DROPBOX_KEY
    // })
    //   .filesListFolder({ path: '/blog' })
    //   // .filesDownload({
    //   //   path: '/index.md',
    //   //   rev: '01d000000013c28fff0'
    //   // })
    //   // .then((data: any) => console.log(data.fileBinary.toString()), console.error);
    //   .then(console.log);
  }

  filstFiles = async () => {
    console.log(await this.dropbox.filesListFolder({ path: '', recursive: true }));
  };

  downloadFile = async (path: string) => {
    try {
      console.log(`Start downloading ${path}`);
      const start = new Date().getTime();
      const response = (await this.dropbox.filesDownload({
        path
      })) as IDropboxFilesDownloadResult;
      console.log(`${path}: ${new Date().getTime() - start}`);
      return response.fileBinary;
    } catch (e) {
      console.log('Error in DropboxAdapter.downloadFile:');
      console.error(e);
    }
    return new ErrorMessage({ statusCode: 404, message: 'File not found' });
  };

  load = async (path: IResourcePath) => {
    if (path === '/') {
      return await this.loadFolder('');
    } else {
      const response = await this.dropbox.filesGetMetadata({ path });
      if (response['.tag'] === 'folder') {
        return await this.loadFolder(path);
      } else if (response['.tag'] === 'file') {
        return this.downloadFile(path);
      }
    }
    return new ErrorMessage({ statusCode: 404, message: 'File not found' });
  };

  loadFolder = async (path: string): Promise<Resource> => {
    const indexMd = (await this.downloadFile(`${path}/index.md`))!.toString();
    const { attributes: fmData, body: content } = fm(indexMd);
    return new Resource({
      data: { ...fmData },
      content: marked(content, { baseUrl: `${path}/` }),
      resourcePath: path,
      subResources: await this.loadSubResources(path)
    });
  };

  loadSubResources = async (path: string) => {
    try {
      const directoryContent = await this.dropbox.filesListFolder({ path });
      const subPaths = directoryContent.entries
        .filter(result => result['.tag'] === 'folder')
        .map(({ name }) => path + '/' + name);

      return Promise.all(subPaths.map(await this.loadFolder));
    } catch (e) {
      console.error(e);
    }
  };
}
