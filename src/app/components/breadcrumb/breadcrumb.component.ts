import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getManageLabel, getManageMap } from '../../core/config/manage.config';

interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [NzBreadCrumbModule, CommonModule, NzIconModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.less',
})
export class BreadcrumbComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  private _rawBreadcrumbs = signal<BreadcrumbItem[]>([]);

  readonly breadcrumbs = computed(() => {
    const raw = this._rawBreadcrumbs();
    return raw.filter((item, index, self) => index === self.findIndex((t) => t.url === item.url));
  });

  constructor() {
    this._router.events

      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateBreadcrumbs());
  }

  ngOnInit() {
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs() {
    this._rawBreadcrumbs.set(this.buildBreadcrumbs(this._activatedRoute.root));
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      const breadcrumbData = child.snapshot.data['breadcrumb'];
      const params = child.snapshot.params;

      let label = this.getLabel(breadcrumbData);

      if (!label && Object.keys(params).length > 0) {
        const paramValue = Object.values(params)[0] as string;

        label = getManageLabel(paramValue);
      }

      if (label && nextUrl !== '/') {
        breadcrumbs.push({
          label: label,
          url: nextUrl,
          icon: child.snapshot.data['icon'] || '',
        });
      }

      this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabel(breadcrumbData: any): string {
    if (!breadcrumbData) return '';

    return typeof breadcrumbData === 'object' ? breadcrumbData.label : breadcrumbData;
  }

  // private formatLabel(raw: string): string {
  //   return StringHelper.capitalizeFirstLetter(StringHelper.formatSlugToText(raw));
  // }

  isLastBreadcrumb(index: number): boolean {
    return index === this.breadcrumbs().length - 1;
  }
}
