import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CollapseService {
  readonly isCollapsed = signal<boolean>(false);

  toggle(): void {
    this.isCollapsed.update((v) => !v);
  }

  setCollapsed(value: boolean): void {
    this.isCollapsed.set(value);
  }
}
