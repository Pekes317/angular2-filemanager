# ngx-filemanager

This package is a fork of [@rign/angular2-filemanager](https://www.npmjs.com/package/@rign/angular2-filemanager) package adjusted to use @angular/material instead of bootstrap and ngx-contextmenu.

This version of the package also uses Google's Material Design icons instead of Font Awesome.

**New Feature**

* Added new Configuration to configure base for Icons URL
* Updated ng2-translate to @ngx-translate/core to Optimize for Angular Universal
* Changed ngx-img-cropper to ngx-image-cropper to Optimize for Angular Universal
* Update Angular to Angular 6.0
* Requires a Feature Module for Tree Module and Filemanager with that below imports

~~~~ 
@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([TreeEffectsService]),
    StoreModule.forFeature('trees', treeReducer),
  ],
  declarations: []
})
export class FolderModule { } 

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([FileManagerEffectsService]),
    StoreModule.forFeature('files', fileManagerReducer)
  ],
  declarations: []
})
export class FilesModule { } 
~~~~