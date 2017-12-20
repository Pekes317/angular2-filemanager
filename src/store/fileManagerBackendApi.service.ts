import {Injectable} from '@angular/core';
import {IOuterNode} from '@rign/angular2-tree';
import {Observable} from 'rxjs/Observable';
import {ICropBounds, IFileManagerApi, IOuterFile, IFileDataProperties} from '../../main';
import {FileManagerConfiguration} from '../configuration/fileManagerConfiguration.service';
import {AbstractFileManagerApiService} from './fileManagerApiAbstract.class';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class FileManagerBackendApiService extends AbstractFileManagerApiService implements IFileManagerApi {

  public constructor(private $http: HttpClient,
                     private configuration: FileManagerConfiguration) {
    super();
    this.nodes = [];
    this.files = [];
  }

  /**
   * Load folder chidls for given folder id
   *
   * @param {string} nodeId
   * @returns {Observable<IOuterNode[]>}
   */
  public load(nodeId = ''): Observable<IOuterNode[]> {
    const nodeIds = this.nodes.map((node: IOuterNode) => node.id);

    const params = new HttpParams().set('nodeId', nodeId || '');

    return this.$http.get<IOuterNode[]>(this.configuration.folderUrls.foldersUrl, {params})
      .map((nodes: IOuterNode[]) => {
        nodes.forEach((node: IOuterNode) => {
          if (nodeIds.indexOf(node.id) === -1) {
            this.nodes.push(node);
          } else {
            const index = this.nodes.findIndex((item: IOuterNode) => node.id === item.id);
            this.nodes[index] = node;
          }
        });

        return nodes;
      });
  }

  /**
   * Create new folder
   *
   * @param {IOuterNode} node
   * @param {string} parentNodeId
   * @returns {Observable<IOuterNode>}
   */
  public add(node: IOuterNode, parentNodeId: string = null): Observable<IOuterNode> {
    const data = {
      node: node,
      parentNodeId: parentNodeId
    };

    return this.$http.post<IOuterNode>(this.configuration.folderUrls.foldersUrl, data)
      .map((newNode: IOuterNode) => {
        this.nodes.push(newNode);

        return newNode;
      })

  }

  /**
   * Move folder from source parent to target parent
   *
   * @param {IOuterNode} srcNode
   * @param {IOuterNode} targetNode
   * @returns {Observable<IOuterNode>}
   */
  public move(srcNode: IOuterNode, targetNode: IOuterNode | null): Observable<IOuterNode> {
    const srcId = srcNode.id;
    const targetId = targetNode ? targetNode.id : null;


    return this.$http.put<IOuterNode>(this.configuration.folderUrls.folderMoveUrl, {source: srcId, target: targetId})
      .map((movedNode: IOuterNode) => {
        const index = this.findIndexByNodeId(srcId);
        this.nodes[index].parentId = targetId;

        return movedNode;
      });
  }

  /**
   * Update folder name
   *
   * @param {IOuterNode} node
   * @returns {Observable<IOuterNode>}
   */
  public update(node: IOuterNode): Observable<IOuterNode> {
    return this.$http.put<IOuterNode>(this.configuration.folderUrls.foldersUrl, node)
      .map((newNode: IOuterNode) => {
        const index = this.findIndexByNodeId(node.id);

        this.nodes[index] = newNode;

        return newNode;
      });
  }

  /**
   * Remove node by given id
   *
   * @param {string} nodeId
   * @returns {Observable<IOuterNode>}
   */
  public remove(nodeId: string): Observable<IOuterNode> {
    const index = this.findIndexByNodeId(nodeId);

    const hasChildren = this.getChildren(nodeId).length > 0;

    if (!hasChildren) {
      const params = new HttpParams().set('nodeId', nodeId);

      return this.$http.delete<IOuterNode>(this.configuration.folderUrls.foldersUrl, {params})
        .map((removedNode: IOuterNode) => {
          this.nodes.splice(index, 1);

          return removedNode;
        });
    } else {
      return Observable.throw('Node is not empty');
    }
  }

  /**
   * Crop file
   *
   * @param {IOuterFile} file
   * @param {ICropBounds} bounds
   * @returns {Observable<IOuterFile>}
   */
  public cropFile(file: IOuterFile, bounds: ICropBounds): Observable<IOuterFile> {
    return this.$http.put<IOuterFile>(this.configuration.fileUrl, {id: file.id, bounds: bounds});
  }

  /**
   * Load files from directory
   *
   * @param {string} nodeId
   * @returns {Observable<IOuterFile[]>}
   */
  public loadFiles(nodeId = ''): Observable<IOuterFile[]> {
    this.currentNodeId = nodeId;
    const params = new HttpParams().set('dirId', nodeId);

    return this.$http.get<IOuterFile[]>(this.configuration.fileUrl, {params})
      .map((files: IOuterFile[]) => {
        this.files = files.map((file: IOuterFile) => <IFileDataProperties>file);

        return files;
      })
  }

  /**
   * Remove file from folder
   *
   * @param {IOuterFile} file
   * @returns {Observable<boolean>}
   */
  public removeFile(file: IOuterFile): Observable<boolean> {
    const index = this.findIndexByFileId(file.id.toString());

    if (index === -1) {
      return Observable.of(false);
    }

    const params = new HttpParams().set('id', file.id.toString());

    return this.$http.delete<any>(this.configuration.fileUrl, {params})
      .map(() => {
        this.files.splice(index, 1);

        return true;
      });
  }

  public removeSelectedFiles(selectedFiles: string[]) {
    const params = new HttpParams().set('id', selectedFiles.join('|'));

    return this.$http.delete<any>(this.configuration.fileUrl, {params})
      .map(() => {
        selectedFiles.forEach((fileId: string) => {
          const index = this.findIndexByFileId(fileId);

          if (index > -1) {
            this.files.splice(index, 1);
          }
        });

        return true;
      });
  }

  /**
   * This method is success method, real upload is done in ExtendedFileUploader
   * @param {IOuterFile} file
   * @returns {Observable<IOuterFile>}
   */
  public uploadFile(file: IOuterFile): Observable<IOuterFile> {
    const fileData = <IFileDataProperties>file;
    this.files.push(fileData);

    return Observable.of(file);
  }

  /**
   * @param {IOuterFile[]} files
   * @param {IOuterNode} node
   * @returns {Observable<IOuterFile[]>}
   */
  public moveFile(files: IOuterFile[], node: IOuterNode): Observable<IOuterFile[]> {
    const ids: string[] = files.map(file => file.id.toString());

    return this.$http.put<IOuterFile[]>(this.configuration.fileUrl, {files: ids, folderId: node ? node.id : ''});
  }

  /**
   * @param {string} nodeId
   * @returns {number}
   */
  private findIndexByNodeId(nodeId: string): number {
    return this.nodes.findIndex((node) => {
      return node.id === nodeId;
    });
  }

  /**
   * @param {string} fileId
   * @returns {number}
   */
  private findIndexByFileId(fileId: string): number {
    return this.files.findIndex((file) => file.id === fileId);
  }

  /**
   * @param {string} nodeId
   * @returns {IOuterNode[]}
   */
  private getChildren(nodeId: string): IOuterNode[] {
    return this.nodes.filter((node: IOuterNode) => node.parentId === nodeId);
  }

  /**
   * @param file
   * @returns {{id: string, folderId: string, name: string, thumbnailUrl: string, url: string, width: number, height: number, mime: string}}
   */
  private convertLocalData2IOuterFile(file: IFileDataProperties): IOuterFile {
    return {
      id: file.id,
      folderId: file.folderId,
      name: file.name,
      thumbnailUrl: file.data,
      url: file.data,
      width: file.width,
      height: file.height,
      type: file.type,
      size: file.size
    }
  }

  /**
   * @param file
   * @returns {{id: (any|string), folderId: string, name: string, type: string, data: string, size: number}}
   */
  private convertIOuterFile2LocalData(file: IOuterFile): IFileDataProperties {
    return {
      id: file.id.toString(),
      folderId: file.folderId,
      name: file.name,
      type: file.type,
      data: file.data,
      size: file.size,
      width: file.width,
      height: file.height
    }
  }
}
