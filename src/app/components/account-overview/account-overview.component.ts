import { Component, computed, inject } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { StatCard } from '../../model/stat-card.mode';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AccountService } from '../../core/services/account.service';
import { VisitorService } from '../../core/services/visitor.service';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [StatCardComponent, NzCardModule, BaseChartDirective],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.less',
})
export class AccountOverviewComponent {
  private _accountService = inject(AccountService);
  private readonly _visitorService = inject(VisitorService);

  readonly statCardList = computed<StatCard[]>(() => [
    {
      name: 'Tổng tài khoản',
      stat: this._accountService.data().length,
    },
    {
      name: 'Số lần ghé thăm trong ngày',
      stat: this._visitorService.countToday(),
    },
  ]);

  readonly trafficToday = this._visitorService.trafficToday;

  ngOnInit(): void {
    this._visitorService.loadCountToday();
    this._visitorService.loadTrafficToday();
  }

  private hoursLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  readonly lineChartData = computed<ChartConfiguration['data']>(() => ({
    datasets: [
      {
        data: this.trafficToday(),
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderColor: '#1890ff',
        pointBackgroundColor: '#1890ff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1890ff',
        fill: 'origin',
        tension: 0.4,
      },
    ],

    labels: this.hoursLabels,
  }));

  protected readonly lineChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        displayColors: false,
        callbacks: {
          title: (items) => `Thời gian: ${items[0].label}`,
          label: (item) => `số người truy cập - ${item.raw} `,
        },
      },
    },
  };

  protected readonly lineChartType: ChartType = 'line';
}
