import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ManageCard } from '../../../core/config/manage.config';

@Component({
  selector: 'app-manage-card',
  standalone: true,
  imports: [NzCardModule, NzIconModule],
  templateUrl: './manage-card.component.html',
  styleUrl: './manage-card.component.less',
})
export class ManageCardComponent {
  readonly card = input<ManageCard>();
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  onNavigate(): void {
    const cardData = this.card();

    if (cardData?.name) {
      const slug = cardData.type;
      this._router.navigate([slug], { relativeTo: this._route });
    }
  }
}
