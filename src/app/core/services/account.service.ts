import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import env from '../../../environments/env';
import { AccountModel } from '../../model/account.model';
import { ApiResponseModel } from '../../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly _http = inject(HttpClient);
  private readonly _API_URL = env.apiUrl + '/accounts';

  private readonly _data = signal<AccountModel[]>([]);
  readonly data = this._data.asReadonly();

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
}
