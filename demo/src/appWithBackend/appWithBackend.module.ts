import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppWithBackendComponent} from './appWithBackend.component';
import {
  FileManagerModule,
  FileManagerApiService,
  IFileManagerConfiguration,
  FileManagerBackendApiService
} from '../../../main';
import {TranslateModule, TranslateService} from 'ng2-translate';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TreeModule} from '@rign/angular2-tree';

const fileManagerConfiguration: IFileManagerConfiguration = {
  urls: {
    foldersUrl: '/api/folder',
    filesUrl: '/api/files',
    folderMoveUrl: '/api/folder/move'
  },
  isMultiSelection: true,
  mimeTypes: ['image/jpg', 'image/jpeg', 'image/png'],
  maxFileSize: 5 * 1024 * 1024
};

@NgModule({
  declarations: [
    AppWithBackendComponent
  ],
  imports: [
    BrowserAnimationsModule,
    EffectsModule.forRoot([]),
    FileManagerModule.forRoot(fileManagerConfiguration, {provide: FileManagerApiService, useClass: FileManagerBackendApiService}),
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
    TreeModule.forRoot(),
    TranslateModule.forRoot(),
  ],
  bootstrap: [AppWithBackendComponent]
})
export class AppWithBackendModule {

  public constructor(translate: TranslateService) {
    translate.use('en');
  }
}
