import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  template: `<ngx-spinner></ngx-spinner>`,
})
export class LoadingComponent {}
