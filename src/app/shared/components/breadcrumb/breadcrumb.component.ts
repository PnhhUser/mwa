import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { filter, distinctUntilChanged } from 'rxjs/operators';

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
    return this._rawBreadcrumbs().filter(
      (item, index, self) => index === self.findIndex((t) => t.url === item.url),
    );
  });

  ngOnInit() {
    this.updateBreadcrumbs();

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs() {
    const newBreadcrumbs = this.buildBreadcrumbs(this._activatedRoute.root);
    this._rawBreadcrumbs.set(newBreadcrumbs);
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      const breadcrumbData = child.snapshot.data['breadcrumb'];

      if (breadcrumbData && nextUrl !== '/') {
        const newBreadcrumb = {
          label: this.getLabel(breadcrumbData),
          url: nextUrl || '/',
          icon: child.snapshot.data['icon'] || '',
        };

        const isDuplicate = breadcrumbs.some((b) => b.url === newBreadcrumb.url);
        if (!isDuplicate) {
          breadcrumbs.push(newBreadcrumb);
        }
      }

      this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs.filter(
      (item, index, self) => index === self.findIndex((t) => t.url === item.url),
    );
  }

  private getLabel(breadcrumbData: any): string {
    if (typeof breadcrumbData === 'string') {
      return breadcrumbData;
    }
    if (typeof breadcrumbData === 'object' && breadcrumbData.label) {
      return breadcrumbData.label;
    }
    return '';
  }

  isLastBreadcrumb(index: number): boolean {
    return index === this._rawBreadcrumbs().length - 1;
  }
}
