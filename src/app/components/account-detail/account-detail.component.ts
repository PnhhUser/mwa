import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { AccountModel, Role } from '../../model/account.model';
import StringHelper from '../../core/helpers/string.helper';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-account-detail.component',
  standalone: true,
  imports: [
    FormsModule,
    NzListModule,
    NzTagModule,
    CommonModule,
    NzButtonModule,
    NzSelectModule,
    NzSwitchModule,
    NzInputModule,
  ],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.less',
})
export class AccountDetailComponent {
  @Input() data!: AccountModel;
  private _drawerRef = inject(NzDrawerRef);
  protected isEdit = signal<boolean>(false);

  editData!: AccountModel;
  role = Role;
  validationErrors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.editData = { ...this.data };
  }

  formatRole(role: Role): string {
    switch (role) {
      case Role.user:
        return 'User';

      case Role.admin:
        return 'Admin';

      default:
        return 'Không xác định';
    }
  }

  formatColor(show: boolean): string {
    return show ? 'green' : 'red';
  }

  onEdit(): void {
    this.isEdit.set(true);
  }

  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.editData.username || this.editData.username.trim() === '') {
      this.validationErrors['username'] = 'Tên người dùng không được để trống';
      return false;
    } else if (this.editData.username.length < 3) {
      this.validationErrors['username'] = 'Tên người dùng phải có ít nhất 3 ký tự';
      return false;
    }

    if (this.editData.email && this.editData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editData.email)) {
        this.validationErrors['email'] = 'Email không hợp lệ';
        return false;
      }
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

    this.data = { ...this.editData };
    this.isEdit.set(false);

    const data = { type: 'edit', closeData: this.data };
    this._drawerRef.close(data);
  }

  onCancel(): void {
    this.isEdit.set(false);
    this.editData = { ...this.data };
  }
}
