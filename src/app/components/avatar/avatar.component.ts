import { Component, inject, Signal } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CollapseService } from '../../core/services/collapse.service';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FirstUpperPipe } from '../../shared/pipes/first-upper-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
    NzTypographyModule,
    CommonModule,
    NzPopoverModule,
    FirstUpperPipe,
    RouterLink,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.less',
})
export class AvatarComponent {
  private _autService = inject(AuthService);
  protected readonly avatar = 'assets/images/avatar.jpg';
  private _collapseService = inject(CollapseService);

  get isCollapsed(): boolean {
    return this._collapseService.isCollapsed().isCollapsed;
  }

  logout(): void {
    this._autService.logout();
  }
}
