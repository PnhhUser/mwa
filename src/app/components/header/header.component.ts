import { NzButtonModule } from 'ng-zorro-antd/button';
import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CollapseService } from '../../core/services/collapse.service';
// import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  private _collapseService = inject(CollapseService);

  isCollapsed = this._collapseService.isCollapsed;

  onToggleNav(): void {
    this._collapseService.toggle();
  }
}
