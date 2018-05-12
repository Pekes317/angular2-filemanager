import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';

import { DropdownComponent } from './dropdown.component';
import { ButtonClass } from './Button.class';
import { IButton } from './IButton';
import { ButtonDividerClass } from './ButtonDivider.class';

describe('dropdown.component', () => {
  let comp: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let de: DebugElement;
  let dropdownElement: HTMLElement;
  let mainButton: ButtonClass;
  let buttons: IButton[];
  let onClickHandler: Function;

  beforeEach(() => {
    mainButton = new ButtonClass({
      symbol: 'SELECT_ALL',
      name: 'Select all',
      label: true,
      icon: true,
      iconCssClass: 'check_box',
      disabled: false
    });

    buttons = [mainButton, new ButtonDividerClass()];

    onClickHandler = jasmine.createSpy('onClickHandler');

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DropdownComponent], // declare the test component
    });

    fixture = TestBed.createComponent(DropdownComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    comp.mainButton = mainButton;
    comp.buttons = buttons;
    comp.displayMainButtonLabel = false;

    comp.onClick
      .subscribe(onClickHandler);

    fixture.detectChanges();
  });

  describe('view', () => {
    it('mainButton should not have label', () => {
      const mainEl = fixture.debugElement.query(By.css('.dropdown'));
      const mainButtonEl = mainEl.children[0];

      expect(mainButtonEl.children.length).toBe(1);
    });

    it('mainButton should have label', () => {
      comp.displayMainButtonLabel = true;
      fixture.detectChanges();

      const mainEl = fixture.debugElement.query(By.css('.dropdown'));
      const mainButtonEl = mainEl.children[0];

      expect(mainButtonEl.children.length).toBe(2);
    });

    it('dropdown should contains two children', () => {
      const dropDownHtml = fixture.debugElement.query(By.css('.dropdown-menu')).nativeElement;

      expect(dropDownHtml.children.length).toBe(2);
    });
  });
});
