import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumnConfig } from '../../model/table.model';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { AccountDetailComponent } from '../account-detail/account-detail.component';
import { AccountModel, UpdateAccountModel } from '../../model/account.model';
import { AccountService } from '../../core/services/account.service';
import { DrawerRemoveComponent } from '../../shared/components/drawer-remove/drawer-remove.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AccountAddComponent } from '../account-add.ts/account-add.component.ts';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    NzButtonModule,
    TableComponent,
    NzInputModule,
    FormsModule,
    NzDrawerModule,
    DrawerRemoveComponent,
    NzModalModule,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.less',
})
export class AccountsComponent {
  @ViewChild('extraTpl') extraTpl!: TemplateRef<any>;
  searchText = signal<string>('');
  private _drawerService = inject(NzDrawerService);
  private readonly _accountService = inject(AccountService);
  private readonly _modalService = inject(NzModalService);

  drawerRef!: NzDrawerRef<AccountDetailComponent, any>;

  colConfig: TableColumnConfig<AccountModel>[] = [
    { header: 'Người dùng', key: 'username', isSearch: true },
    { header: 'Kích hoạt', key: 'isActive', isStatus: true, align: 'center' },
  ];

  ngOnInit(): void {
    this._accountService.load();
  }

  ngOnChanges(): void {
    this._accountService.load();
  }

  private debouncedSearch = toSignal(
    toObservable(this.searchText).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  filteredData = computed(() => {
    const rawData = this._accountService.data() || [];

    const search = this.debouncedSearch()?.toLowerCase().trim();

    const sortedData = [...rawData].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (!search) {
      return sortedData;
    }

    const searchableKeys = this.colConfig.filter((col) => col.isSearch).map((col) => col.key);

    return sortedData.filter((item) =>
      searchableKeys.some((key) => {
        const value = String((item as any)[key]).toLowerCase();
        return value.includes(search);
      }),
    );
  });

  handleRowClick(user: AccountModel): void {
    this.drawerRef = this._drawerService.create({
      nzWidth: 350,
      nzTitle: 'Chi tiết người dùng',
      nzContentParams: {
        data: user,
      },
      nzContent: AccountDetailComponent,
      nzBodyStyle: {
        padding: 0,
      },
      nzClosable: false,
      nzExtra: this.extraTpl,
    });

    this.drawerRef.afterClose.subscribe({
      next: (data) => {
        if (!data) {
          return;
        }

        const { type, closeData } = data;

        if (type === 'edit') {
          this.handleEditModel(closeData);
        }

        if (type === 'remove') {
          this.handleRemoveModal(closeData);
        }
      },
    });
  }

  protected handleEditModel(user: UpdateAccountModel): void {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: `Bạn có muốn chỉnh sửa tài khoản ${user.username} này không?`,
      nzOnOk: () => {
        this._accountService.update(user);
      },
      nzOnCancel: () => {},
      nzOkText: 'Xác nhận',
      nzCancelText: 'Đóng',
    });
  }

  protected handleRemoveModal(user: AccountModel): void {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: `Bạn có muốn xóa phần tử ${user.username} này không?`,
      nzOnOk: () => {
        this._accountService.remove(user.id);
      },
      nzOnCancel: () => {},
      nzOkText: 'Xác nhận',
      nzCancelText: 'Đóng',
    });
  }

  protected handleAddDrawer(): void {
    const drawerAddRef = this._drawerService.create({
      nzTitle: 'Thêm thẻ',
      nzWidth: 350,
      nzContent: AccountAddComponent,
      nzBodyStyle: {
        padding: 0,
      },
      nzClosable: false,
    });

    drawerAddRef.afterClose.subscribe({
      next: (data) => {
        if (!data) {
          return;
        }

        this._accountService.add(data);
      },
    });
  }

  protected handleRemove(): void {
    const user = this.drawerRef.getContentComponent()?.data;

    if (!user) {
      return;
    }

    const data = {
      type: 'remove',
      closeData: user,
    };

    this.drawerRef.close(data);
  }
}
