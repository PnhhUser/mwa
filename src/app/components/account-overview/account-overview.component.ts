import { Component } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { StatCard } from '../../model/stat-card.mode';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [StatCardComponent, NzCardModule, BaseChartDirective],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.less',
})
export class AccountOverviewComponent {
  statCardList: StatCard[] = [
    {
      name: 'Tổng tài khoản',
      stat: 0,
    },
    {
      name: 'Tổng tài khoản bị khóa',
      stat: 0,
    },
    {
      name: 'Đang trực tuyến',
      stat: 0,
    },
    {
      name: 'Số lần ghé thăm trong ngày',
      stat: 0,
    },
  ];

  private hoursLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  private trafficData = [
    0, 2, 1, 0, 2, 10, 35, 70, 90, 110, 85, 70, 65, 80, 75, 95, 120, 150, 130, 100, 80, 50, 30, 15,
  ];

  protected readonly lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.trafficData,
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
  };

  protected readonly lineChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
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
