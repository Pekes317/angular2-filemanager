import { Injectable, Inject } from '@angular/core';
import { IContextMenu } from '@beezleeart/ngx-tree';

import { IFileTypeFilter } from '../toolbar/interface/IFileTypeFilter';
import { ICropSize } from '../crop/ICropSize';
import { IFileManagerConfiguration } from './IFileManagerConfiguration';

@Injectable()
export class FileManagerConfiguration {

  public allowedCropSize: ICropSize[] = [
    {
      name: 'RI_FM_BTN_LANDSCAPE',
      width: 300,
      height: 100
    },
    {
      name: 'RI_FM_BTN_PORTRAIT',
      width: 200,
      height: 300
    },
    {
      name: 'RI_FM_BTN_SQUARE',
      width: 300,
      height: 300
    }
  ];

  public contextMenuItems: IContextMenu[] = [];

  public fileTypesFilter: IFileTypeFilter[] = [
    {
      name: 'ALL',
      mimes: [],
      iconCls: 'insert_drive_file',
      text: 'All files',
      defaultSelected: true
    },
    {
      name: 'IMAGES',
      mimes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/png'],
      iconCls: 'image',
      text: 'Images'
    },
    {
      name: 'AUDIO',
      mimes: ['audio/mpeg', 'audio/x-ms-wma', 'audio/vnd.rn-realaudio', 'audio/x-wav', 'audio/mp3'],
      iconCls: 'radio',
      text: 'Audio'
    },
    {
      name: 'VIDEO',
      mimes: ['video/mpeg', 'video/mp4', 'video/quicktime', 'video/x-ms-wmv'],
      iconCls: 'movie',
      text: 'Video'
    },
    {
      name: 'ARCHIVE',
      mimes: ['application/zip'],
      iconCls: 'archive',
      text: 'Archive'
    }
  ];

  public folderUrls: { foldersUrl: string, folderMoveUrl: string };
  public fileUrl = '/api/files';
  public iconUrl = '/icons';

  public isMultiSelection: boolean;

  public maxFileSize: number;

  public mimeTypes: string[] | null;

  public allowChooseMultipleFiles: boolean;

  public authToken: string;

  constructor(@Inject('fileManagerConfiguration') configuration: IFileManagerConfiguration) {
    const { foldersUrl, folderMoveUrl } = configuration.urls;
    this.folderUrls = { foldersUrl, folderMoveUrl };
    this.fileUrl = configuration.urls.filesUrl;
    this.iconUrl = configuration.urls.iconUrl || '/icons';
    this.isMultiSelection = configuration.isMultiSelection || false;
    this.maxFileSize = configuration.maxFileSize || 0;
    this.mimeTypes = configuration.mimeTypes || null;
    this.allowChooseMultipleFiles = configuration.allowChooseMultipleFiles || false;
    this.authToken = configuration.authToken || '';
  }
}
