import { Component, computed, inject, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumnConfig } from '../../model/table.model';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';

interface User {
  id: string;
  name: string;
  active: boolean;
  online: boolean;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [NzButtonModule, TableComponent, NzInputModule, FormsModule, NzDrawerModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.less',
})
export class AccountsComponent {
  searchText = signal<string>('');
  private _drawerService = inject(NzDrawerService);
  userData: User[] = [{ id: 'jd6f7sdf67d6fdf6', name: 'admin', active: true, online: false }];

  colConfig: TableColumnConfig<User>[] = [
    { header: 'Người dùng', key: 'name', isSearch: true },
    { header: 'Kích hoạt', key: 'active', sortable: true, isStatus: true, align: 'center' },
    { header: 'Trực tuyến', key: 'online', sortable: true, isStatus: true, align: 'center' },
  ];

  private debouncedSearchTerm = toSignal(
    toObservable(this.searchText).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  filteredData = computed(() => {
    const search = this.debouncedSearchTerm()?.toLowerCase().trim();

    if (!search) {
      return this.userData;
    }

    const searchableKeys = this.colConfig.filter((col) => col.isSearch).map((col) => col.key);

    return this.userData.filter((item) =>
      searchableKeys.some((key) => {
        const value = String((item as any)[key]).toLowerCase();
        return value.includes(search);
      }),
    );
  });

  handleRowClick(user: User): void {
    this._drawerService.create({
      nzWidth: 350,
      nzTitle: 'Chi tiết người dùng',
      nzData: user,
    });
  }
}
