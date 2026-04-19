import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, RouterOutlet],
  templateUrl: './manage.page.html',
  styleUrl: './manage.page.less',
})
export class ManagePage {}
