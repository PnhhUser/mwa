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

  // Khởi tạo state từ localStorage
  private _isAuthenticated = LocalHelper.get<boolean>(this._FLAG_KEY) === true;
  private readonly _data = signal<AuthResponseModel>(
    LocalHelper.get<AuthResponseModel>(this._DATA_KEY) ?? { 
      id: '', 
      displayName: '', 
      role: '' 
    }
  );

  readonly data = this._data.asReadonly();

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  login(dto: any): Observable<any> {
    return this.http.post<ApiResponseModel<AuthResponseModel>>(
      `${this._API_URL}/login`, 
      dto
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setAuthData(res.data);
        }
      }),
    );
  }

  checkAuthStatus(): Observable<boolean> {
    // Nếu chưa có flag login trong storage => chưa đăng nhập
    if (!LocalHelper.get<boolean>(this._FLAG_KEY)) {
      return of(false);
    }

    return this.http
      .post<ApiResponseModel<AuthResponseModel>>(
        `${this._API_URL}/refresh-token`,
        {}
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setAuthData(res.data);
          }
        }),
        map((res) => {
          this._isAuthenticated = res.success;
          return res.success;
        }),
        catchError(() => {
          this.purgeAuth();
          return of(false);
        }),
      );
  }

  refreshToken(): Observable<any> {
    // Kiểm tra state hiện tại
    if (!this._isAuthenticated) {
      return of(null);
    }

    return this.http
      .post<ApiResponseModel<AuthResponseModel>>(
        `${this._API_URL}/refresh-token`, 
        {}
      )
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
      .subscribe({
        next: (res) => {
          if (res.success) {
            this._alertService.show('', res.message, 'success');
          }
        },
        error: (err) => {
          console.error('Logout error:', err);
        }
      });
  }

  private setAuthData(data: AuthResponseModel): void {
    // Lưu vào localStorage
    LocalHelper.set(this._FLAG_KEY, true);
    LocalHelper.set(this._DATA_KEY, data);

    // Cập nhật state
    this._isAuthenticated = true;
    this._data.set(data);
    
    // Khởi động timer refresh token
    this.startRefreshTimer();
  }

  private purgeAuth(): void {
    // Xóa localStorage
    LocalHelper.remove(this._FLAG_KEY);
    LocalHelper.remove(this._DATA_KEY);

    // Reset state
    this._isAuthenticated = false;
    this._data.set({ 
      id: '', 
      displayName: '', 
      role: '' 
    });
    
    // Clear timer
    this.clearTimer();
  }

  private startRefreshTimer(): void {
    this.clearTimer();
    const delay = 28800000; // 8 tiếng (nên tính toán dựa trên thời gian hết hạn token thực tế)
    this._refreshTimer = setTimeout(() => {
      // Chỉ refresh nếu vẫn còn authenticated
      if (this._isAuthenticated) {
        this.refreshToken().subscribe();
      }
    }, delay);
  }

  private clearTimer(): void {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
  }
}