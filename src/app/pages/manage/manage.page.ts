import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, RouterOutlet],
  templateUrl: './manage.page.html',
  styleUrl: './manage.page.less',
})
export class ManagePage {}
