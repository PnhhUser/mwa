import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap, catchError, map, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import env from '../../../environments/env';
import ROUTES_PATH from '../consts/route.const';
import { LocalHelper } from '../helpers/local.helper';
import { AlertService } from './alert.service';
import { ApiResponseModel } from '../../model/api.model';
import { AuthResponseModel } from '../../model/authModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _refreshTimer: any;
  private readonly _DATA_KEY = 'user_data';
  private readonly _FLAG_KEY = 'is_logged_in';
  private readonly _API_URL = env.apiUrl + '/auth';

  private _alertService = inject(AlertService);
  private http = inject(HttpClient);
  private router = inject(Router);

  private _isLoginIn = LocalHelper.get<boolean>(this._FLAG_KEY) === true;
  private readonly _data = signal<AuthResponseModel>(
    LocalHelper.get<AuthResponseModel>(this._DATA_KEY) ?? { id: '', displayName: '', role: '' },
  );

  readonly data = this._data.asReadonly();

  public get isAuthenticated(): boolean {
    return this._isLoginIn;
  }

  login(dto: any): Observable<any> {
    return this.http.post<ApiResponseModel<AuthResponseModel>>(`${this._API_URL}/login`, dto).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setAuthData(res.data);
        }
      }),
    );
  }

  checkAuthStatus(): Observable<boolean> {
    if (!LocalHelper.get<boolean>(this._FLAG_KEY)) {
      this.purgeAuth();
      return of(false);
    }

    return this.http
      .post<ApiResponseModel<AuthResponseModel>>(`${this._API_URL}/refresh-token`, {})
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setAuthData(res.data);
          }
        }),
        map((res) => res.success),
        catchError(() => {
          this.purgeAuth();
          return of(false);
        }),
      );
  }

  refreshToken(): Observable<any> {
    if (!this.isAuthenticated) return of(null);

    return this.http
      .post<ApiResponseModel<AuthResponseModel>>(`${this._API_URL}/refresh-token`, {})
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setAuthData(res.data);
          }
        }),
        catchError((err) => {
          this.purgeAuth();
          this.router.navigate([`/${ROUTES_PATH.login}`]);
          return of(err);
        }),
      );
  }

  logout(): void {
    this.http
      .post<ApiResponseModel<any>>(`${this._API_URL}/logout`, {})
      .pipe(
        finalize(() => {
          this.purgeAuth();
          this.router.navigate([`/${ROUTES_PATH.login}`]);
        }),
      )
      .subscribe((res) => {
        if (res.success) this._alertService.show('', res.message, 'success');
      });
  }

  private setAuthData(data: AuthResponseModel): void {
    LocalHelper.set(this._FLAG_KEY, true);
    LocalHelper.set(this._DATA_KEY, data);

    this._isLoginIn = true;
    this._data.set(data);
    this.startRefreshTimer();
  }

  private purgeAuth(): void {
    LocalHelper.remove(this._FLAG_KEY);
    LocalHelper.remove(this._DATA_KEY);

    this._isLoginIn = false;
    this._data.set({ id: '', displayName: '', role: '' });
    this.clearTimer();
  }

  private startRefreshTimer(): void {
    this.clearTimer();
    const delay = 28800000; // 8 tiếng
    this._refreshTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, delay);
  }

  private clearTimer(): void {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
    }
  }
}
