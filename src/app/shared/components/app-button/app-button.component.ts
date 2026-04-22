import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css'],
})
export class AppButtonComponent {
  @Input() label: string = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;

  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    if (!this.loading && !this.disabled) {
      this.btnClick.emit();
    }
  }
}
