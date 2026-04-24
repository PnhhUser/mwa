import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-drawer-close',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  template: `
    <button nz-button nzDanger (click)="onRemove()">
      <nz-icon nzType="delete" nzTheme="outline" />
      <span>Xóa</span>
    </button>
  `,
})
export class DrawerRemoveComponent {
  @Output() remove = new EventEmitter<void>();

  onRemove(): void {
    this.remove.emit();
  }
}
