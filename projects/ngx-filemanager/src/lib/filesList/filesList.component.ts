import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

import { FileModel } from './file.model';
import { IFileEvent } from './interface/IFileEvent';
import { IFileModel } from './interface/IFileModel';
import { FileManagerConfiguration } from '../configuration/fileManagerConfiguration.service';
import { IFileManagerAction } from '../store/fileManagerActions.service';
import { FileManagerDispatcherService } from '../store/fileManagerDispatcher.service';
import { FileManagerEffectsService } from '../store/fileManagerEffects.service';

@Component({
  selector: 'ri-files-list',
  templateUrl: './files.html',
  styleUrls: ['./files-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class FilesListComponent {
  @Input() files: FileModel[];
  @Input() selectedFiles: string[];

  @Output() onPreviewFile = new EventEmitter();
  @Output() onCropFile = new EventEmitter();
  @Output() onSelectFile = new EventEmitter();

  public removeTitle = 'Remove file';

  public constructor(public configuration: FileManagerConfiguration,
    private fileManagerDispatcher: FileManagerDispatcherService,
    notifications: NotificationsService,
    fileManagerEffects: FileManagerEffectsService) {

    fileManagerEffects.deleteFileSuccess$
      .subscribe((action: IFileManagerAction) => {
        notifications.success('File delete', `${action.payload.file.name} has been deleted`);
      });
  }

  /**
   * Fired when clicked on button "delete file"
   *
   * @param file
   */
  public deleteFile(file: IFileModel) {
    this.fileManagerDispatcher.deleteFile(file);
  }

  public getRemoveMessage(file: IFileModel) {
    return 'You are try to delete <b>' + file.name + '</b>. Are you sure?';
  }

  public openPreview(fileEvent: IFileEvent): void {
    this.onPreviewFile.emit(fileEvent);
  }

  public openCrop(fileEvent: IFileEvent): void {
    this.onCropFile.emit(fileEvent);
  }

  public toggleSelection(file: IFileModel): void {
    console.log(file);
    if (file.selected) {
      this.fileManagerDispatcher.unSelectFile(file);
    } else {
      this.fileManagerDispatcher.selectFile(file);
    }
  }

  public isSelected(file: FileModel): boolean {
    return this.selectedFiles.indexOf(file.getId().toString()) > -1;
  }
}
