import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableComponent } from '../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableColumnConfig } from '../../model/table.model';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import { FlashCard } from '../../model/flash-card.model';
import { DrawerRemoveComponent } from '../../shared/components/drawer-remove/drawer-remove.component';
import { DrawerCloseData } from '../../model/drawer.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CardAddComponent } from '../card-add/card-add.component';

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
  searchText = signal<string>('');
  private _drawerService = inject(NzDrawerService);
  private _modalService = inject(NzModalService);

  drawerRef!: NzDrawerRef<CardDetailComponent, any>;

  cardData: FlashCard[] = [
    {
      id: 'a1',
      type: 'character',
      script: 'hiragana',
      term: 'あ',
      reading: 'a',
      show: true,
    },

    {
      id: 'k1',
      type: 'character',
      script: 'katakana',
      term: 'ア',
      reading: 'a',
      show: true,
    },

    {
      id: 'j1',
      type: 'character',
      script: 'kanji',
      term: '日',
      reading: 'nichi / hi',
      meaning: 'ngày, mặt trời',
      show: true,
    },

    {
      id: 'w1',
      type: 'vocabulary',
      script: 'hiragana',
      term: 'ねこ',
      reading: 'neko',
      meaning: 'con mèo',
      show: true,
    },
  ];

  protected readonly colConfig: TableColumnConfig<FlashCard>[] = [
    {
      header: 'Hiển thị',
      key: 'show',
      width: '85px',
      isStatus: true,
      align: 'center',
    },
    { header: 'Loại', key: 'script', isScript: true, width: '95px' },
    { header: 'Mục học', key: 'term', isBold: true },
    { header: 'Nghĩa', key: 'meaning' },
    { header: '', key: 'reading', isHide: true, isSearch: true },
  ];

  private debouncedSearchTerm = toSignal(
    toObservable(this.searchText).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  filteredData = computed(() => {
    const search = this.debouncedSearchTerm()?.toLowerCase().trim();

    if (!search) {
      return this.cardData;
    }

    const searchableKeys = this.colConfig.filter((col) => col.isSearch).map((col) => col.key);

    return this.cardData.filter((item) =>
      searchableKeys.some((key) => {
        const value = String((item as any)[key]).toLowerCase();
        return value.includes(search);
      }),
    );
  });

  handleRowClick(card: FlashCard): void {
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
      next: (data: DrawerCloseData<FlashCard>) => {
        if (!data) {
          return;
        }

        const { type, closeData } = data;

        if (type === 'edit') {
          console.log(type, closeData);
        }

        if (type === 'remove') {
          this.handleRemoveModal(closeData);
        }
      },
    });
  }

  handleRemove(): void {
    const card = this.drawerRef.getContentComponent()?.card;

    if (!card) {
      return;
    }

    const data: DrawerCloseData<FlashCard> = {
      type: 'remove',
      closeData: card,
    };

    this.drawerRef.close(data);
  }

  handleRemoveModal(card: FlashCard): void {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: `Bạn có muốn xóa phần tử ${card.term} này không?`,
      nzOnOk: () => {},
      nzOnCancel: () => {},
      nzOkText: 'Xác nhận',
      nzCancelText: 'Đóng',
    });
  }

  handleAddDrawer(): void {
    this._drawerService.create({
      nzTitle: 'Thêm thẻ',
      nzWidth: 350,
      nzContent: CardAddComponent,
      nzBodyStyle: {
        padding: 0,
      },
      nzClosable: false,
    });
  }
}
