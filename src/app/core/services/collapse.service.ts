import { Injectable, signal } from '@angular/core';
import { CollapseModel } from '../../model/collapse.model';

@Injectable({
  providedIn: 'root',
})
export class CollapseService {
  private _collapseState = signal<CollapseModel>({ isCollapsed: false });

  readonly isCollapsed = this._collapseState.asReadonly();

  toggle(): void {
    this._collapseState.update((s) => ({ ...s, isCollapsed: !s.isCollapsed }));
  }
}
