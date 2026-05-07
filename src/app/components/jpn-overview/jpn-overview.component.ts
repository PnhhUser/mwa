import { Component, computed, inject } from '@angular/core';
import { StatCard } from '../../model/stat-card.mode';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { JapaneseService } from '../../core/services/Japanese.service';

import { JapaneseType, JapaneseTypeface } from '../../model/japanese.model';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './jpn-overview.component.html',
  styleUrl: './jpn-overview.component.less',
})
export class ProductOverviewComponent {
  private readonly _japaneseService = inject(JapaneseService);

  readonly statCardList = computed<StatCard[]>(() => [
    {
      name: 'Thẻ Hiragana',
      stat: this._japaneseService
        .data()
        .filter(
          (i) => i.typeface === JapaneseTypeface.HIRAGANA && i.type === JapaneseType.CHARACTER,
        ).length,
    },
    {
      name: 'Thẻ từ vựng',
      stat: this._japaneseService.data().filter((i) => i.type === JapaneseType.VOCABULARY).length,
    },
  ]);
}
