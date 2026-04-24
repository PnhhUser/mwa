import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CollapseService } from '../../core/services/collapse.service';
import { NavModel } from '../../model/nav.model';
import ROUTES_PATH from '../../core/consts/route.const';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzTooltipModule,
    RouterModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.less',
})
export class NavComponent {
  private _collapseService = inject(CollapseService);

  navData: NavModel[] = [
    {
      title: 'Trình quản lí',
      icon: 'windows',
      route: '/' + ROUTES_PATH.manage,
    },
  ];

  isCollapsed = this._collapseService.isCollapsed;
}
