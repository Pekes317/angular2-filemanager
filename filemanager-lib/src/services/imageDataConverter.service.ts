import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';

export interface IFileDataProperties {
  id: string | number;
  folderId: string;
  name: string;
  size: number;
  data: string;
  type: string;
  width?: number;
  height?: number;
  selected?: boolean;
}

export interface IImageDimensions {
  width: number;
  height: number;
}

@Injectable()
export class ImageDataConverter {
  public getProperties(file: File, folderId: string): Observable<IFileDataProperties> {
    let properties: IFileDataProperties = {
      id: UUID.UUID(),
      folderId: folderId,
      name: file.name,
      size: file.size,
      type: file.type,
      data: ''
    };

    let reader = this.getBase64FromFile(file);

    return reader
      .pipe(
        concatMap((data: string) => {
          properties.data = data;

          if (properties.type.indexOf('image') === 0) {
            return this.getImageDimensions(data);
          } else {
            return Observable.of({ width: 0, height: 0 });
          }
        }),
        map((dimensions: IImageDimensions) => {
          properties.width = dimensions.width;
          properties.height = dimensions.height;

          return properties;
        })

      )
  }

  /**
   * Create observable which return image as base64 data
   */
  private getBase64FromFile(file: File): Observable<string> {
    let reader = new FileReader();
    reader.readAsDataURL(file);


    return Observable
      .fromEvent(reader, 'load')
      .pipe(
        map(() => {
          return reader.result;
        })
      );
  };

  /**
   * Create observable which return dimensions of the image
   */
  private getImageDimensions(data: string): Observable<IImageDimensions> {
    let image = new Image();
    image.src = data;
    image.style.display = 'none';

    const loadImage = Observable.fromEvent(image, 'load')
      .map(() => {
        return {
          width: image.naturalWidth,
          height: image.naturalHeight
        }
      });

    document.body.appendChild(image);

    return loadImage;
  }
}
