import { Component } from '@angular/core';

import { FileManagerConfiguration, FileManagerDispatcherService } from '../../projects/ngx-filemanager/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './appWithBackend.component.html',
  styleUrls: ['./appWithBackend.component.scss']
})
export class AppWithBackendComponent {
  public constructor(public fileManagerConfiguration: FileManagerConfiguration,
    private fileManagerDispatcher: FileManagerDispatcherService) {
  }

  public toggleMultiSelection() {
    this.fileManagerConfiguration.isMultiSelection = !this.fileManagerConfiguration.isMultiSelection;

    if (!this.fileManagerConfiguration.isMultiSelection) {
      this.fileManagerDispatcher.unSelectAllFiles();
    }
  }
}
