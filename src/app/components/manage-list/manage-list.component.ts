import { Component } from '@angular/core';
import { ManageCardComponent } from '../../shared/components/manage-card/manage-card.component';
import { MANAGE_MAP } from '../../core/config/manage.config';
import { ManageCard } from '../../model/manage-card.model';

@Component({
  selector: 'app-dashboard-list-manager',
  standalone: true,
  imports: [ManageCardComponent],
  templateUrl: './manage-list.component.html',
  styleUrl: './manage-list.component.less',
})
export class ManageListComponent {
  cardManageList: ManageCard[] = MANAGE_MAP;
}
