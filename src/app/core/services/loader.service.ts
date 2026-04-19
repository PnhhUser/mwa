import { effect, inject, Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _spinnerService = inject(NgxSpinnerService);

  private _active = signal<boolean>(false);

  readonly active = this._active.asReadonly();

  constructor() {
    effect(() => {
      if (this._active()) {
        this._spinnerService.show();
      } else {
        this._spinnerService.hide();
      }
    });
  }

  turnOn(): void {
    this._active.set(true);
  }

  turnOff(): void {
    this._active.set(false);
  }
}
