import { inject, Injectable, signal } from '@angular/core';
import env from '../../../environments/env';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../../model/api.model';
import { JapaneseModel } from '../../model/japanese.model';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class JapaneseService {
  private readonly _API_URL = env.apiUrl + '/japanese';
  private readonly _http = inject(HttpClient);
  private _alertService = inject(AlertService);

  private readonly _data = signal<JapaneseModel[]>([]);
  readonly data = this._data.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _loaded = false;

  load(): void {
    if (this._loaded || this._loading()) return;

    this._loading.set(true);

    this._http.get<ApiResponseModel<JapaneseModel[]>>(this._API_URL).subscribe({
      next: (res) => {
        if (res.data) {
          this._data.set(res.data);
          this._loaded = true;
        }
      },
      error: (err) => console.error(err),

      complete: () => {
        this._loading.set(false);
      },
    });
  }

  update(japanese: JapaneseModel): void {
    this._loading.set(true);

    this._http.put(this._API_URL, japanese).subscribe({
      next: () => {
        this._data.update((list) =>
          list.map((item) => (item.id === japanese.id ? { ...japanese } : item)),
        );
      },
      error: (err) => {
        console.error(err);
        this._loading.set(false);
      },
      complete: () => this._loading.set(false),
    });
  }

  add(japanese: JapaneseModel): void {
    this._loading.set(true);

    this._http.post<ApiResponseModel<JapaneseModel>>(this._API_URL, japanese).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this._data.update((list) => [...list, res.data as JapaneseModel]);
        } else {
          this._alertService.show('', res.message, 'warning');
        }
      },
      error: (err) => {
        console.error('error service', err);
      },
      complete: () => {
        this._loading.set(false);
      },
    });
  }

  remove(id: string): void {
    this._loading.set(true);
    this._http.delete(`${this._API_URL}/${id}`).subscribe({
      next: () => {
        this._data.update((list) => list.filter((item) => item.id !== id));
      },
      error: (err) => console.error(err),
      complete: () => {
        this._loading.set(false);
      },
    });
  }
}
