import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { AccountModel, AddAccountModel, Role } from '../../model/account.model';

@Component({
  selector: 'app-account-add',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzListModule,
    NzButtonModule,
    NzSelectModule,
    NzSwitchModule,
    NzInputModule,
  ],
  templateUrl: './account-add.component.ts.html',
  styleUrl: './account-add.component.ts.less',
})
export class AccountAddComponent {
  private _drawerRef = inject(NzDrawerRef);

  accountData: AddAccountModel = {
    username: '',
    email: '',
    password: '',
    role: Role.user,
    isActive: true,
  };

  role = Role;
  validationErrors: { [key: string]: string } = {};

  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.accountData.username || this.accountData.username.trim() === '') {
      this.validationErrors['username'] = 'Tên người dùng không được để trống';
      return false;
    } else if (this.accountData.username.length < 3) {
      this.validationErrors['username'] = 'Tên người dùng phải có ít nhất 3 ký tự';
      return false;
    }

    if (this.accountData.email && this.accountData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.accountData.email)) {
        this.validationErrors['email'] = 'Email không hợp lệ';
        return false;
      }
    }

    if (!this.accountData.password || this.accountData.password.trim() === '') {
      this.validationErrors['password'] = 'Mật khẩu không được để trống';
      return false;
    } else if (this.accountData.password.length < 6) {
      this.validationErrors['password'] = 'Mật khẩu phải có ít nhất 6 ký tự';
      return false;
    }

    return true;
  }

  hasError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  getErrorMessage(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  onConfirm(): void {
    if (!this.validateForm()) {
      return;
    }

    this._drawerRef.close(this.accountData);
  }

  onCancel(): void {
    this._drawerRef.close();
  }
}
