import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NzTableModule, NzTableSortFn } from 'ng-zorro-antd/table';
import { TableColumnConfig, TableConfig } from '../../../model/table.model';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { KanaType } from '../../../model/japanese.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzTagModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.less',
})
export class TableComponent<T> {
  data = input<T[]>([]);
  columns = input<TableColumnConfig<T>[]>([]);
  config = input<TableConfig>({ pageSize: 8, pagination: true, bordered: true });
  rowClick = output<T>();

  trackKey = input<keyof T | null>(null);

  trackByFn = (index: number, item: T) => {
    const key = this.trackKey();
    return key ? (item as any)[key] : item;
  };

  getCellValue(item: T, key: keyof T | string): any {
    return (item as any)[key];
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  getSortFn(key: keyof T | string): NzTableSortFn<T> {
    return (a: T, b: T) => {
      const valA = (a as any)[key];
      const valB = (b as any)[key];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }

      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return valA === valB ? 0 : valA ? -1 : 1;
      }

      return 0;
    };
  }

  getTypefaceColor(typeface: number): string {
    switch (typeface) {
      case 1:
        return 'geekblue';
      case 2:
        return 'purple';
      case 3:
        return 'red';
      default:
        return 'blue';
    }
  }

  formatTypeface(typeface: number): string {
    switch (typeface) {
      case 1:
        return 'Hiragana';
      case 2:
        return 'Katakana';
      case 3:
        return 'Kanji';
      default:
        return typeface.toString();
    }
  }

  formatType(type: number): string {
    switch (type) {
      case 1:
        return 'Ký tự';
      case 2:
        return 'Từ vựng';
      default:
        return type.toString();
    }
  }

  getTypeColor(type: number): string {
    switch (type) {
      case 1:
        return 'cyan';
      case 2:
        return 'magenta';
      default:
        return 'blue';
    }
  }

  formatKana(type: number): string {
    switch (type) {
      case 1:
        return 'Dakaon';
      case 2:
        return 'Handakuon';
      case 3:
        return 'Yoon';
      case 4:
        return 'Sokuon';
      case 5:
        return 'Smallkana';
      case 6:
        return 'Seion';
      default:
        return '';
    }
  }

  getKanaColor(type: number): string {
    switch (type) {
      case KanaType.Seion: // 6
        return 'geekblue'; // Xanh tím (của NZ)
      case KanaType.Dakuon: // 1
        return 'volcano'; // Đỏ cam nhẹ (gần với đỏ phấn)
      case KanaType.Handakuon: // 2
        return 'orange'; // Cam
      case KanaType.Yoon: // 3
        return 'cyan'; // Xanh dương nhạt
      case KanaType.Sokuon: // 4
        return 'purple'; // Tím
      case KanaType.SmallKana: // 5
        return 'green'; // Xanh lá mint nhẹ
      default:
        return 'default'; // Xám
    }
  }

  visibleColumns() {
    return this.columns().filter((col) => !col.isHide);
  }

  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }
}
