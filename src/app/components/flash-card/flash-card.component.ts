import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableComponent } from '../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableColumnConfig } from '../../model/table.model';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { CardDetailComponent } from '../detail-card/detail-card.component';
import { DrawerRemoveComponent } from '../../shared/components/drawer-remove/drawer-remove.component';
import { DrawerCloseData } from '../../model/drawer.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CardAddComponent } from '../add-card/add-card.component';
import { JapaneseService } from '../../core/services/Japanese.service';
import { JapaneseModel } from '../../model/japanese.model';

@Component({
  selector: 'app-product-type',
  standalone: true,
  imports: [
    NzCardModule,
    NzIconModule,
    TableComponent,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzDrawerModule,
    DrawerRemoveComponent,
    NzModalModule,
  ],
  templateUrl: './flash-card.component.html',
  styleUrl: './flash-card.component.less',
})
export class FlashCardComponent {
  @ViewChild('extraTpl') extraTpl!: TemplateRef<any>;
  protected searchText = signal<string>('');
  private readonly _drawerService = inject(NzDrawerService);
  private readonly _modalService = inject(NzModalService);

  drawerRef!: NzDrawerRef<CardDetailComponent, any>;

  private readonly _japaneseService = inject(JapaneseService);

  ngOnInit(): void {
    this._japaneseService.load();
  }

  ngOnChanges(): void {
    this._japaneseService.load();
  }

  protected readonly colConfig: TableColumnConfig<JapaneseModel>[] = [
    {
      header: 'Hiển thị',
      key: 'isShow',
      width: '85px',
      isStatus: true,
      align: 'center',
    },
    {
      header: 'Loại thẻ',
      key: 'type',
      isType: true,
      width: '85px',
      align: 'center',
    },
    {
      header: 'Loại chữ',
      key: 'typeface',
      isTypeface: true,
      width: '88px',
      align: 'center',
    },
    { header: 'Mục học', key: 'term', isBold: true },
    { header: '', key: 'reading', isHide: true, isSearch: true },
    { header: '', key: 'romaji', isHide: true, isSearch: true },
  ];

  private debouncedSearch = toSignal(
    toObservable(this.searchText).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  filteredData = computed(() => {
    const rawData = this._japaneseService.data() || [];

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

  protected handleRowClick(card: JapaneseModel): void {
    this.drawerRef = this._drawerService.create({
      nzWidth: 350,
      nzTitle: 'Chi tiết thẻ',
      nzContentParams: {
        card,
      },
      nzContent: CardDetailComponent,
      nzBodyStyle: {
        padding: 0,
      },
      nzClosable: false,
      nzExtra: this.extraTpl,
    });

    this.drawerRef.afterClose.subscribe({
      next: (data: DrawerCloseData<JapaneseModel>) => {
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

  protected handleRemove(): void {
    const card = this.drawerRef.getContentComponent()?.card;

    if (!card) {
      return;
    }

    const data: DrawerCloseData<JapaneseModel> = {
      type: 'remove',
      closeData: card,
    };

    this.drawerRef.close(data);
  }

  protected handleRemoveModal(card: JapaneseModel): void {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: `Bạn có muốn xóa phần tử ${card.term} này không?`,
      nzOnOk: () => {
        this._japaneseService.remove(card.id);
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
      nzContent: CardAddComponent,
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

        this._japaneseService.add(data);
      },
    });
  }

  protected handleEditModel(card: JapaneseModel): void {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: `Bạn có muốn chỉnh sửa phần tử ${card.term} này không?`,
      nzOnOk: () => {
        this._japaneseService.update(card);
      },
      nzOnCancel: () => {},
      nzOkText: 'Xác nhận',
      nzCancelText: 'Đóng',
    });
  }
}
