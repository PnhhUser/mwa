import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { CollapseService } from '../../core/services/collapse.service';
import { NavComponent } from '../../components/nav/nav.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    RouterOutlet,
    AvatarComponent,
    NavComponent,
    HeaderComponent,
  ],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.less',
})
export class LayoutMain {
  private _collapseService = inject(CollapseService);

  isCollapsed = this._collapseService.isCollapsed;

  onCollapsedChange(collapsed: boolean): void {
    this._collapseService.setCollapsed(collapsed);
  }
}
