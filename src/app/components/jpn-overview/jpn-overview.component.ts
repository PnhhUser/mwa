import { Component, computed, inject } from '@angular/core';
import { StatCard } from '../../model/stat-card.mode';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { JapaneseService } from '../../core/services/Japanese.service';

import { JapaneseStatConfig, StatConfig } from '../../core/config/stat.config';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './jpn-overview.component.html',
  styleUrl: './jpn-overview.component.less',
})
export class ProductOverviewComponent {
  private readonly _japaneseService = inject(JapaneseService);

  ngOnInit(): void {
    this._japaneseService.load();
  }

  private readonly statConfigs: StatConfig[] = JapaneseStatConfig;

  statCardList = computed<StatCard[]>(() => {
    const data = this._japaneseService.data();

    return this.statConfigs.map((config) => ({
      name: config.name,
      stat: this.count(data, config.predicate),
    }));
  });

  private count<T>(list: T[], predicate: (item: T) => boolean): number {
    return list.reduce((acc, item) => acc + (predicate(item) ? 1 : 0), 0);
  }
}
