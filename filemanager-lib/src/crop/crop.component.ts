import {
  Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output,
  EventEmitter, AfterContentInit
} from '@angular/core';
import { ImageCropperComponent } from 'ngx-image-cropper';

import { FileModel } from '../filesList/file.model';
import { ICropSize } from './ICropSize';
import { FileManagerConfiguration } from '../configuration/fileManagerConfiguration.service';
import { ICropBounds, ICropper } from './ICropBounds';
import { FileManagerDispatcherService } from '../store/fileManagerDispatcher.service';

@Component({
  selector: 'crop-image',
  styleUrls: ['./crop.scss'],
  template: `
    <div class="crop-image">
      <div class="crop-workbench">
        <div #container></div>
      </div>
      <div class="btn-toolbar">
        <mat-button-toggle-group>
          <mat-button-toggle *ngFor="let cropSize of cropSizeList" (click)="updateCropSize(cropSize)"
            [checked]="cropSize === currentCropSize" [value]="cropSize">{{cropSize.name | translate}}</mat-button-toggle>
        </mat-button-toggle-group>
        <div class="btn-right">
          <button mat-raised-button (click)="cropImage()" color="accent">
            <mat-icon>check</mat-icon>
            <span>{{'RI_FM_BTN_SAVE' | translate}}</span>
          </button>
        </div>
      </div>
    </div>
  `
})

export class CropComponent implements AfterContentInit {
  @Input() file: FileModel;

  @Output() onCrop = new EventEmitter();

  @ViewChild('container', { read: ViewContainerRef })
  public container: ViewContainerRef;

  @ViewChild('cropper')
  public cropper: ImageCropperComponent;

  private bounds: ICropper;

  public cropSizeList: ICropSize[];
  public currentCropSize: ICropSize;

  constructor(private resolver: ComponentFactoryResolver,
    private configuration: FileManagerConfiguration,
    private fileManagerDispatcher: FileManagerDispatcherService) {
    this.cropSizeList = configuration.allowedCropSize;
  }

  updateCropSize(cropSize: ICropSize) {
    let image = new Image();
    const cropperComponent = this.resolver.resolveComponentFactory(ImageCropperComponent);
    const cropperComponentRef = this.container.createComponent(cropperComponent);

    if (this.container.length > 1) {
      this.container.detach(0);
    }

    this.currentCropSize = cropSize;
    cropperComponentRef.instance.aspectRatio = cropSize.width / cropSize.height;
    this.bounds = cropperComponentRef.instance.cropper;

    setTimeout(() => {
      image.src = this.file.url;
      cropperComponentRef.instance.imageBase64 = image.src;
    });
  }

  ngAfterContentInit() {
    this.updateCropSize(this.cropSizeList[0]);
  };

  public cropImage() {
    console.log(this.bounds);
    let bounds: ICropBounds = {
      x: this.bounds.x1,
      y: this.bounds.y1,
      width: this.bounds.x2,
      height: this.bounds.y2
    };

    this.fileManagerDispatcher.cropFile(this.file, bounds);
  }

  /**
   * Calculates scale between current file dimensions and box 600x600
   */
  private calculateScale(): number {
    let scale = this.file.getWidth() / this.file.getHeight();

    if (scale > 1) {
      if (this.file.getWidth() > 600) {
        return 600 / this.file.getWidth();
      }
    } else {
      if (this.file.getHeight() > 600) {
        return 600 / this.file.getHeight();
      }
    }

    return 1;
  }
}
