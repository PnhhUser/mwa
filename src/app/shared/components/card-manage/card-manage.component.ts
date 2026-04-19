import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CardManage } from '../../../model/card-manage.model';

@Component({
  selector: 'app-card-manage',
  standalone: true,
  imports: [NzCardModule, NzIconModule],
  templateUrl: './card-manage.component.html',
  styleUrl: './card-manage.component.less',
})
export class CardManageComponent {
  readonly card = input<CardManage>();
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  onNavigate(): void {
    this._router.navigate([this.card()?.id, 'overview'], { relativeTo: this._route });
  }
}
