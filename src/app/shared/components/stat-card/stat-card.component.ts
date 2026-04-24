import { Component, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { StatCard } from '../../../model/stat-card.mode';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NzCardModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.less',
})
export class StatCardComponent {
  readonly card = input<StatCard>();

  protected formatNumber(num: number | string): string {
    return Number(num).toLocaleString('en-US');
  }
}
