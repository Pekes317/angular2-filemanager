import { FolderModule } from './folder.module';

describe('TreeModule', () => {
  let folderModule: FolderModule;

  beforeEach(() => {
    folderModule = new FolderModule();
  });

  it('should create an instance', () => {
    expect(folderModule).toBeTruthy();
  });
});
