import { Component, OnInit, OnDestroy, signal } from '@angular/core'; // Thêm signal
import DateHelper from '../../core/helpers/timer.helper';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.less',
})
export class TimerComponent implements OnInit, OnDestroy {
  protected readonly fullTime = signal<string>(DateHelper.getFullDateTime());

  private timerInterval: any;

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.fullTime.set(DateHelper.getFullDateTime());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
