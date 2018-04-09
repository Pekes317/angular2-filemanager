import { IOuterNode } from '@beezleeart/ngx-tree';

import { IFileDataProperties } from '../services/imageDataConverter.service';

export abstract class AbstractFileManagerApiService {

  protected treeName = 'fileManagerTree';
  protected fileManagerName = 'fileManagerFiles';


  protected nodes: IOuterNode[];
  protected files: IFileDataProperties[];

  protected currentNodeId = '';
}
