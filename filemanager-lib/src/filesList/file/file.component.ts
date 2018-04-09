import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';

import { IFileModel } from '../interface/IFileModel';
import { FileManagerConfiguration } from '../../configuration/fileManagerConfiguration.service';
import { IFileEvent } from '../interface/IFileEvent';
import { FileManagerDispatcherService } from '../../store/fileManagerDispatcher.service';
import { FileConfirmDialog } from './file-confirm.component';

@Component({
  selector: 'ri-file-component',
  styles: [
    `.file-menu .actions {
      display: flex;
      justify-content: space-around;
      transform: scale(.75);
    }`
  ],
  templateUrl: './file.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FileComponent {
  @Input() file: IFileModel;

  @Output() onPreviewFile = new EventEmitter();
  @Output() onCropFile = new EventEmitter();
  @Output() onSelectFile = new EventEmitter();

  public removeTitle = 'Remove file';

  public constructor(public configuration: FileManagerConfiguration, private dialog: MatDialog,
    private fileManagerDispatcher: FileManagerDispatcherService) {
  }

  /**
   * Fired when clicked on button "delete file"
   *
   * @param file
   */
  public deleteFile($event: MouseEvent, file: IFileModel) {
    let dialogRef = this.dialog.open(FileConfirmDialog, {
      data: { title: this.removeTitle, message: this.getRemoveMessage(file) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fileManagerDispatcher.deleteFile(file);
      }
    });

    $event.preventDefault();
    $event.stopPropagation();
  }

  public getRemoveMessage(file: IFileModel) {
    return 'You are try to delete <b>' + file.name + '</b>. Are you sure?';
  }

  public openPreview($event: MouseEvent): void {
    let fileEvent: IFileEvent = {
      eventName: 'onPreviewFile',
      file: this.file
    };
    this.onPreviewFile.emit(fileEvent);

    $event.preventDefault();
    $event.stopPropagation();
  }

  public openCrop($event: MouseEvent): void {
    let fileEvent: IFileEvent = {
      eventName: 'onCropFile',
      file: this.file
    };
    this.onCropFile.emit(fileEvent);

    $event.preventDefault();
    $event.stopPropagation();
  }

  public selectFile(): void {
    this.fileManagerDispatcher.selectFile(this.file);
  }

  public unSelectFile(): void {
    this.fileManagerDispatcher.unSelectFile(this.file);
  }

  public chooseFile($event: MouseEvent, file: IFileModel): void {
    this.fileManagerDispatcher.chooseFiles([file.toJSON()]);

    $event.preventDefault();
    $event.stopPropagation();
  }
}
