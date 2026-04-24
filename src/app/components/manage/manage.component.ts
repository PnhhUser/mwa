import { Component, inject, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TABS_MAP, TabConfig } from '../../core/config/tabs.config';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, NzTabsModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.less',
})
export class ManageComponent {
  private route = inject(ActivatedRoute);

  currentTabs = signal<TabConfig[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const name = params['manageName'];
      if (name) {
        const decodedName = decodeURIComponent(name);

        const config = TABS_MAP[decodedName] || [];
        this.currentTabs.set(config);
      }
    });
  }
}
