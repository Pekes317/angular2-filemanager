import { HttpClientModule } from '@angular/common/http';
import { CommonModule  } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Provider, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from '@beezleeart/ngx-tree';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-image-cropper';

import { FileManagerComponent } from './filemanager/filemanager.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FilesListComponent } from './filesList/filesList.component';
import { CropComponent } from './crop/crop.component';
import { PreviewComponent } from './preview/preview.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FileManagerConfiguration } from './configuration/fileManagerConfiguration.service';
import { FileManagerUploader } from './filesList/fileManagerUploader.service';
import { TreeService } from './configuration/tree.service';
import { FileManagerEffectsService } from './store/fileManagerEffects.service';
import { fileManagerReducer } from './store/fileManagerReducer';
import { FileManagerActionsService } from './store/fileManagerActions.service';
import { FileTypeFilterService } from './services/fileTypeFilter.service';
import { SearchFilterService } from './services/searchFilter.service';
import { FileManagerDispatcherService } from './store/fileManagerDispatcher.service';
import { FileTypeFilterComponent } from './toolbar/fileTypeFilter/fileTypeFilter.component';
import { SearchFileComponent } from './toolbar/searchFile/searchFile.component';
import { FileManagerApiService } from './store/fileManagerApi.service';
import { ImageDataConverter } from './services/imageDataConverter.service';
import { FilemanagerNotifcations } from './services/FilemanagerNotifcations';
import { FileManagerBackendApiService } from './store/fileManagerBackendApi.service';
import { CurrentDirectoryFilesService } from './services/currentDirectoryFiles.service';
import { SelectionComponent } from './toolbar/selectionDropDown/selection.component';
import { FileComponent } from './filesList/file/file.component';
import { IFileManagerConfiguration } from './configuration/IFileManagerConfiguration';
import { MaterialModule } from './material/material.module';
import { FileConfirmDialog } from './filesList/file/file-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    ConfirmationPopoverModule,
    EffectsModule,
    FormsModule,
    FileUploadModule,
    HttpClientModule,
    ImageCropperModule,
    MaterialModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    StoreModule,
    StoreDevtoolsModule.instrument({}),
    TranslateModule,
    TreeModule
  ],
  declarations: [
    FileManagerComponent,
    FileComponent,
    FileConfirmDialog,
    FileTypeFilterComponent,
    ToolbarComponent,
    FilesListComponent,
    DropdownComponent,
    PreviewComponent,
    CropComponent,
    SearchFileComponent,
    SelectionComponent
  ],
  entryComponents: [
    FileConfirmDialog,
    ImageCropperComponent
  ],
  exports: [ FileManagerComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FileManagerModule {

  public static forRoot(config: IFileManagerConfiguration, apiProvider: Provider = null): ModuleWithProviders {
    return {
      ngModule: FileManagerModule,
      providers: [
        CurrentDirectoryFilesService,
        FileManagerActionsService,
        FileManagerApiService,
        FileManagerBackendApiService,
        FileManagerConfiguration,
        FileManagerDispatcherService,
        FileManagerEffectsService,
        FilemanagerNotifcations,
        FileManagerUploader,
        FileTypeFilterService,
        ImageDataConverter,
        NotificationsService,
        SearchFilterService,
        TreeService,
        { provide: 'fileManagerConfiguration', useValue: config },
        apiProvider ? apiProvider : FileManagerApiService
      ]
    }
  }

  public static forChild(config: IFileManagerConfiguration, apiProvider: Provider = null): ModuleWithProviders {
    return {
      ngModule: FileManagerModule,
      providers: [
        CurrentDirectoryFilesService,
        FileManagerActionsService,
        FileManagerApiService,
        FileManagerBackendApiService,
        FileManagerConfiguration,
        FileManagerDispatcherService,
        FileManagerEffectsService,
        FilemanagerNotifcations,
        FileManagerUploader,
        FileTypeFilterService,
        ImageDataConverter,
        NotificationsService,
        SearchFilterService,
        TreeService,
        { provide: 'fileManagerConfiguration', useValue: config },
        apiProvider ? apiProvider : FileManagerApiService
      ]
    }
  }
}
