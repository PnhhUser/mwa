import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NzTableModule, NzTableSortFn } from 'ng-zorro-antd/table';
import { TableColumnConfig, TableConfig } from '../../../model/table.model';
import { NzTagModule } from 'ng-zorro-antd/tag';

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

  getScriptColor(script: string): string {
    switch (script) {
      case 'hiragana':
        return 'geekblue';
      case 'katakana':
        return 'purple';
      case 'kanji':
        return 'red';
      default:
        return 'blue';
    }
  }

  formatScript(script: string): string {
    switch (script) {
      case 'hiragana':
        return 'Hiragana';
      case 'katakana':
        return 'Katakana';
      case 'kanji':
        return 'Kanji';
      default:
        return script;
    }
  }

  visibleColumns() {
    return this.columns().filter((col) => !col.isHide);
  }

  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }
}
