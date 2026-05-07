import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import env from '../../../environments/env';
import { AccountModel, AddAccountModel, UpdateAccountModel } from '../../model/account.model';
import { ApiResponseModel } from '../../model/api.model';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly _http = inject(HttpClient);
  private readonly _API_URL = env.apiUrl + '/accounts';

  private readonly _data = signal<AccountModel[]>([]);
  readonly data = this._data.asReadonly();

  private _alertService = inject(AlertService);

  private _loaded = false;

  load(): void {
    if (this._loaded) return;

    this._http.get<ApiResponseModel<AccountModel[]>>(this._API_URL).subscribe({
      next: (res) => {
        if (res.data) {
          this._data.set(res.data);
          this._loaded = true;
        }
      },
      error: (err) => console.error(err),
    });
  }

  update(user: UpdateAccountModel): void {
    this._http.put(this._API_URL, user).subscribe({
      next: () => {
        this._data.update((list) =>
          list.map((item) => (item.id === user.id ? { ...(user as AccountModel) } : item)),
        );

        this._alertService.show('', 'Sửa tài khoản thành công', 'success');
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  add(user: AddAccountModel): void {
    this._http.post<ApiResponseModel<AccountModel>>(this._API_URL, user).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this._data.update((list) => [...list, res.data as AccountModel]);
          this._alertService.show('', 'Thêm tài khoản thành công', 'success');
        } else {
          this._alertService.show('', res.message, 'warning');
        }
      },
      error: (err) => {
        console.error('error service', err);
      },
      complete: () => {},
    });
  }

  remove(id: string): void {
    this._http.delete(`${this._API_URL}/${id}`).subscribe({
      next: () => {
        this._data.update((list) => list.filter((item) => item.id !== id));
      },
      error: (err) => console.error(err),
      complete: () => {},
    });
  }
}
