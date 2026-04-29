import { Component, inject, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TABS_MAP, TabConfig } from '../../core/config/tabs.config';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, NzTabsModule],
  templateUrl: './manage.component.html',
})
export class ManageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentTabs = signal<TabConfig[]>([]);
  tabIndex = 0;

  ngOnInit() {
    // load tabs theo route param
    this.route.params.subscribe((params) => {
      const name = params['manageName'];
      if (name) {
        const decodedName = decodeURIComponent(name);
        const config = TABS_MAP[decodedName] || [];
        this.currentTabs.set(config);

        // Tìm index dựa vào slug từ URL
        const tabSlug = params['tabSlug'];
        if (tabSlug) {
          const foundIndex = config.findIndex((tab) => tab.slug === tabSlug);
          if (foundIndex !== -1) {
            this.tabIndex = foundIndex;
          }
        }
      }
    });
  }

  onTabChange(index: number) {
    this.tabIndex = index;
    const manageName = this.route.snapshot.params['manageName'];
    const currentTabs = this.currentTabs();

    if (currentTabs && currentTabs[index]) {
      const slug = currentTabs[index].slug;
      // Navigate với slug thay vì số
      this.router.navigate([`/manage/${manageName}/${slug}`]);
    }
  }
}
