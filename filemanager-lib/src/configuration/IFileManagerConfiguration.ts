import { IUrlConfiguration } from './IUrlConfiguration';

export interface IFileManagerConfiguration {
  urls: IUrlConfiguration;
  authToken?: string;
  isMultiSelection?: boolean;
  maxFileSize?: number;
  mimeTypes?: string[];
  allowChooseMultipleFiles: boolean;
}
