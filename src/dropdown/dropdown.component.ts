import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IButtonData } from './IButton';

@Component({
  selector: 'ri-dropdown',
  styleUrls: ['./dropdown.less'],
  templateUrl: './dropdown.html'
})

export class DropdownComponent {
  @Input() mainButton: IButtonData;
  @Input() buttons: IButtonData[];
  @Input() displayMainButtonLabel: boolean;

  @Output() onClick = new EventEmitter();

  public selectButton(button: IButtonData): void {
    this.onClick.emit(button);
  }
}
