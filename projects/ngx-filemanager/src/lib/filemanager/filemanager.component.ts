import {
  Component, OnInit, ViewChild, HostListener, EventEmitter, Output, OnDestroy
} from '@angular/core';
import {
  TreeComponent,
  NodeService,
  IContextMenu,
  IOuterNode,
  ITreeData,
  ITreeState,
  IConfiguration,
  TreeModel,
  TreeActionsService,
  treeStateSelector,
  NodeDispatcherService,
} from '@beezleeart/ngx-tree';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'angular2-notifications';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { FileModel } from '../filesList/file.model';
import { IFileEvent } from '../filesList/interface/IFileEvent';
import { Button } from '../toolbar/models/button.model';
import { FilesListComponent } from '../filesList/filesList.component';
import { IToolbarEvent } from '../toolbar/interface/IToolbarEvent';
import { IFileModel } from '../filesList/interface/IFileModel';
import { FileManagerConfiguration } from '../configuration/fileManagerConfiguration.service';
import { FileManagerDispatcherService } from '../store/fileManagerDispatcher.service';
import { FileManagerEffectsService } from '../store/fileManagerEffects.service';
import { FileManagerApiService } from '../store/fileManagerApi.service';
import { FilemanagerNotifcations, INotification } from '../services/FilemanagerNotifcations';
import { CurrentDirectoryFilesService } from '../services/currentDirectoryFiles.service';
import { IOuterFile } from '../filesList/interface/IOuterFile';


@Component({
  selector: 'ri-filemanager',
  providers: [NodeService, NotificationsService],
  styleUrls: ['./filemanager.scss'],
  templateUrl: './filemanager.html'
})
export class FileManagerComponent implements OnInit, OnDestroy {
  @Output() onSingleFileSelect = new EventEmitter();

  @ViewChild(TreeComponent)
  public treeComponent: TreeComponent;

  @ViewChild(FilesListComponent)
  public filesList: FilesListComponent;

  /**
   * List of files for current selected directory
   */
  private files$: Observable<FileModel[]>;

  public filteredFiles$: Observable<FileModel[]>;
  public selectedFiles$: Observable<string[]>;

  public folders: Observable<ITreeData>;


  public treeConfiguration: IConfiguration = {
    showAddButton: false,
    disableMoveNodes: false,
    treeId: 'tree',
    dragZone: 'tree',
    dropZone: ['tree']
  };

  public treeModel: TreeModel;

  /** UNSED **/
  public contextMenu: IContextMenu[] = [];

  public currentSelectedFile: IFileModel;
  public currentSelectedFilesIds: string[] = [];
  public currentSelectedFiles: IOuterFile[] = [];

  public isPreviewMode = false;
  public isCropMode = false;

  public notificationOptions = {
    position: ['bottom', 'right'],
    timeOut: 3000,
    lastOnBottom: false,
    preventDuplicates: true,
    rtl: false,
    showProgressBar: true,
    pauseOnHover: true
  };

  /**
   * List of context menu
   */
  public menu: IContextMenu[];

  private subscription = new Subscription();

  public constructor(private store: Store<ITreeState>,
    private treeActions: TreeActionsService,
    private nodeDispatcherService: NodeDispatcherService,
    private treeService: FileManagerApiService,
    private notifications: NotificationsService,
    private configuration: FileManagerConfiguration,
    private fileManagerDispatcher: FileManagerDispatcherService,
    private fileManagerEffects: FileManagerEffectsService,
    private filemanagerNotifcations: FilemanagerNotifcations,
    private currentDirectoryFilesService: CurrentDirectoryFilesService) {

    this.menu = configuration.contextMenuItems;

    this.filemanagerNotifcations.getNotificationStream()
      .subscribe((notification: INotification) => {
        const { type, title, message } = notification;

        this.notifications[type](title, message);
      });

    this.subscription.add(
      this.currentDirectoryFilesService.selectedFiles$
        .subscribe((data: string[]) => {
          this.currentSelectedFilesIds = data;
        })
    );

    this.subscription.add(
      Observable.combineLatest(
        this.currentDirectoryFilesService.selectedFiles$,
        this.currentDirectoryFilesService.entities$,
      )
        .subscribe(([ids, entities]: [string[], { [key: string]: IOuterFile }]) => {
          this.currentSelectedFiles = ids.map((id) => entities[id]);
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnInit(): void {

    /*** START - init TREE ***/
    const treeId = this.treeConfiguration.treeId;
    this.nodeDispatcherService.register(treeId, this.treeService);

    this.store.dispatch(this.treeActions.registerTree(treeId));

    this.folders = this.store.select(treeStateSelector)
      .pipe(
        map((data: ITreeState) => {
          return data[treeId];
        }),
        filter((data: ITreeData) => !!data)
      );

    this.treeModel = new TreeModel(this.folders, this.treeConfiguration);
    /*** END - init TREE ***/


    /*** START - init files ***/
    this.files$ = this.currentDirectoryFilesService.files$;
    this.filteredFiles$ = this.currentDirectoryFilesService.filteredFiles$;
    this.selectedFiles$ = this.currentDirectoryFilesService.selectedFiles$;


    this.subscription.add(
      this.treeModel.currentSelectedNode$
        .subscribe((node: IOuterNode | null) => {
          this.loadFiles(node ? node.id : '');
        })
    );

    /*** END - init files ***/
    this.subscription.add(
      this.fileManagerEffects.cropFileSuccess$
        .subscribe(() => {
          this.closeModal();
        })
    );
  }

  get currentSelectedFolderId(): string | null {
    const value = this.treeModel.currentSelectedNode$.getValue();

    return value ? value.id : null;
  }


  public onAddFolder() {
    this.treeComponent.onAdd();
  }

  /***********************************************************************
   * FILE EVENTS
   **********************************************************************/
  /**
   * Run when all files are uploaded
   */
  public onUpload(folderId: string) {
    this.notifications.success('File upload', 'Upload complete');
  }


  public onPreviewFile(fileEventData: IFileEvent) {
    this.isPreviewMode = true;
    this.currentSelectedFile = fileEventData.file;
  }


  public onOpenCropFileEditor(fileEventData: IFileEvent) {
    this.isCropMode = true;
    this.currentSelectedFile = fileEventData.file;
  }


  public onSelectFile(event: FileModel) {
    this.onSingleFileSelect.next(event.getSelectData());
  }

  /***********************************************************************
   * TOOLBAR EVENTS
   **********************************************************************/


  public onMenuButtonClick(event: IToolbarEvent) {
    switch (event.name) {
      case Button.CHOOSE_SELECTION:
        this.fileManagerDispatcher.chooseFiles(this.currentSelectedFiles);
        break;
      case Button.DELETE_SELECTION:
        this.fileManagerDispatcher.deleteSelectedFiles(this.currentSelectedFilesIds);
        break;
      case Button.SELECT_ALL:
        this.fileManagerDispatcher.selectAllFiles();
        break;
      case Button.UNSELECT_ALL:
        this.fileManagerDispatcher.unSelectAllFiles();
        break;
      case Button.INVERSE_SELECTION:
        this.fileManagerDispatcher.inverseSelection();
        break;
      case Button.REFRESH_FILES_LIST:
        this.reloadFiles();
        break;
    }
  }

  /***********************************************************************
   * OTHER FUNCTIONS
   **********************************************************************/
  @HostListener('window:keydown', ['$event'])
  public keyEvents(event: KeyboardEvent) {
    if (this.isPreviewMode || this.isCropMode) {
      if (event.keyCode === 27) {
        this.closeModal();
      }
    }
  }

  public closeModal() {
    this.isPreviewMode = false;
    this.isCropMode = false;
  }


  private loadFiles(folderId: string) {
    this.fileManagerDispatcher.loadFiles(folderId || '');
  }

  private reloadFiles() {
    const node = this.treeModel.currentSelectedNode$.getValue();
    const id = node ? node.id : '';

    this.loadFiles(id);
  }
}
