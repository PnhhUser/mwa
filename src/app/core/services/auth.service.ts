import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import env from '../../../environments/env';
import ROUTES_PATH from '../consts/route.const';
import { LocalHelper } from '../helpers/local.helper';
import { AlertService } from './alert.service';
import { ApiResponseModel } from '../../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _refreshTimer: any;
  private readonly _FLAG_KEY = 'is_logged_in';
  private readonly _API_URL = env.apiUrl + '/auth';
  private _isLoginIn = LocalHelper.get<boolean>(this._FLAG_KEY) === true;
  private _alertService = inject(AlertService);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public get isAuthenticated(): boolean {
    return this._isLoginIn;
  }

  login(dto: any): Observable<any> {
    return this.http.post(`${this._API_URL}/login`, dto).pipe(
      tap((res: any) => {
        if (res.success) {
          LocalHelper.set(this._FLAG_KEY, true);
          this._isLoginIn = true;
          this.startRefreshTimer();
        }
      }),
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const hasFlag = LocalHelper.get<boolean>(this._FLAG_KEY) === true;

    if (!hasFlag) {
      this._isLoginIn = false;
      return of(false);
    }

    return this.http.post(`${this._API_URL}/refresh-token`, {}).pipe(
      tap((res: any) => {
        this._isLoginIn = true;
        this.startRefreshTimer();
      }),
      map(() => true),
      catchError(() => {
        this._isLoginIn = false;
        return of(false);
      }),
    );
  }

  refreshToken(): Observable<any> {
    if (!this.isAuthenticated) return of(null);

    return this.http.post(`${this._API_URL}/refresh-token`, {}).pipe(
      tap(() => {
        this.startRefreshTimer();
      }),
      catchError((err) => {
        this.logout();
        return of(err);
      }),
    );
  }

  logout() {
    this.http.post<ApiResponseModel<any>>(`${this._API_URL}/logout`, {}).subscribe((res) => {
      this._alertService.show('', res.message, 'success');
    });
    LocalHelper.remove(this._FLAG_KEY);
    this._isLoginIn = false;
    this.clearTimer();
    this.router.navigate([`/${ROUTES_PATH.login}`]);
  }

  private startRefreshTimer() {
    this.clearTimer();

    const delay = 28800000; // 8 tiếng

    this._refreshTimer = setTimeout(() => {
      this.refreshToken().subscribe();
    }, delay);
  }

  private clearTimer() {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
    }
  }
}
