import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import env from '../../../environments/env';

import { ApiResponseModel } from '../../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly _API_URL = env.apiUrl + '/visitors';

  private readonly _http = inject(HttpClient);

  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  private readonly _countToday = signal<number>(0);
  readonly countToday = this._countToday.asReadonly();

  private readonly _trafficToday = signal<number[]>([]);
  readonly trafficToday = this._trafficToday.asReadonly();

  loadCount(): void {
    this._http.get<ApiResponseModel<number>>(`${this._API_URL}/count`).subscribe({
      next: (res) => {
        if (res.success && res.data !== null) {
          this._count.set(res.data ?? 0);
        }
      },

      error: (err) => {
        console.error(err);
      },

      complete: () => {},
    });
  }

  loadCountToday(): void {
    this._http.get<ApiResponseModel<number>>(`${this._API_URL}/count-today`).subscribe({
      next: (res) => {
        if (res.success && res.data !== null) {
          this._countToday.set(res.data ?? 0);
        }
      },

      error: (err) => {
        console.error(err);
      },

      complete: () => {},
    });
  }

  loadTrafficToday(): void {
    this._http.get<ApiResponseModel<number[]>>(`${this._API_URL}/traffic-today`).subscribe({
      next: (res) => {
        if (res.success && res.data !== null) {
          this._trafficToday.set(res.data);
        }
      },

      error: (err) => {
        console.error('error: ', err);
      },
    });
  }
}
