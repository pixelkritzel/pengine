import { IResourceData } from './DataAdapter';
import { truncateContent } from '../theme/components/Summary/truncateContent';

const DEFAULT_DATA = {
  draft: false
};

export function mergeDefaultFrontMatterData(dataFromFile: any, content: string): IResourceData {
  const data = { ...DEFAULT_DATA, ...dataFromFile };
  data.date = Number.isNaN(Date.parse(dataFromFile.date)) ? new Date(0) : new Date(dataFromFile.date);
  data.summary = dataFromFile.summary || truncateContent(content, { plainText: true });
  return data;
}
