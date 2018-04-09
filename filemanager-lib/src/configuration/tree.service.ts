import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { NodeService } from '@beezleeart/ngx-tree';

import { IFileManagerConfiguration } from './IFileManagerConfiguration';

@Injectable()
export class TreeService extends NodeService {
  public constructor(protected http: HttpClient, @Inject('fileManagerConfiguration') configuration: IFileManagerConfiguration) {
    super(http);

    this.apiConfig = {
      addUrl: configuration.urls.foldersUrl,
      getUrl: configuration.urls.foldersUrl,
      updateUrl: configuration.urls.foldersUrl,
      removeUrl: configuration.urls.foldersUrl,
      moveUrl: configuration.urls.folderMoveUrl
    };
  }
}
