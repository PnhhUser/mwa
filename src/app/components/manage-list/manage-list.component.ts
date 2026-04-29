import { Component, computed, inject } from '@angular/core';
import { ManageCardComponent } from '../../shared/components/manage-card/manage-card.component';
import { getManageMap, MANAGE_TYPE, ManageCard } from '../../core/config/manage.config';
import { JapaneseService } from '../../core/services/Japanese.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-dashboard-list-manager',
  standalone: true,
  imports: [ManageCardComponent],
  templateUrl: './manage-list.component.html',
  styleUrl: './manage-list.component.less',
})
export class ManageListComponent {
  private readonly _japaneseService = inject(JapaneseService);
  private readonly _accountService = inject(AccountService);

  readonly cardManageList = computed<ManageCard[]>(() => {
    const accountCount = this._accountService.data().length;
    const japaneseCount = this._japaneseService.data().length;

    const counts = {
      [MANAGE_TYPE.japanese]: japaneseCount,
      [MANAGE_TYPE.account]: accountCount,
    };

    return getManageMap(counts);
  });

  ngOnInit(): void {
    this._japaneseService.load();
    this._accountService.load();
  }
}
