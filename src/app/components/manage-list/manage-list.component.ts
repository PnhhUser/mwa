import { Component } from '@angular/core';
import { CardManageComponent } from '../../shared/components/card-manage/card-manage.component';
import { CardManage } from '../../model/card-manage.model';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-dashboard-list-manager',
  standalone: true,
  imports: [CardManageComponent, NzCardModule, NzIconModule],
  templateUrl: './manage-list.component.html',
  styleUrl: './manage-list.component.less',
})
export class ManageList {
  cardManageList: CardManage[] = [
    {
      id: '4654dsf64dsf5sdf',
      name: 'Learn rank',
    },
  ];

  addNewCard(): void {
    console.log('Mở modal hoặc chuyển hướng trang tạo mới...');
  }
}
