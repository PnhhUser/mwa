import { Component } from '@angular/core';
import { StatCard } from '../../model/stat-card.mode';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './jpn-overview.component.html',
  styleUrl: './jpn-overview.component.less',
})
export class ProductOverviewComponent {
  statCardList: StatCard[] = [
    {
      name: 'Thẻ Hiragana',
      stat: 0,
    },
    {
      name: 'Thẻ Katakana',
      stat: 0,
    },
    {
      name: 'Thẻ Kanji',
      stat: 0,
    },
    {
      name: 'Thẻ từ',
      stat: 0,
    },
  ];
}
