import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private toastr: ToastrService) {}

  // Thêm tham số duration vào đây
  show(
    title: string,
    msg: string,
    type: 'error' | 'success' | 'info' | 'warning' = 'info',
    duration: number = 3000,
  ) {
    this.toastr[type](msg, title, {
      timeOut: duration,
    });
  }
}
