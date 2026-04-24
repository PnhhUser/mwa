import { Route, Routes } from '@angular/router';
import ROUTES_PATH from '../../core/consts/route.const';
import { ManagePage } from './manage.page';
import BREADCRUMB from '../../core/consts/breadcrumb.const';
import { ManageComponent } from '../../components/manage/manage.component';
import { ManageListComponent } from '../../components/manage-list/manage-list.component';

export const ManageRoute: Routes = [
  {
    path: ROUTES_PATH.manage,
    component: ManagePage,
    data: { breadcrumb: BREADCRUMB.manage, icon: 'windows' },
    children: [
      {
        path: '',
        component: ManageListComponent,
      },
      {
        path: ':' + ROUTES_PATH.manage_name,
        component: ManageComponent,
      },
    ],
  },
];
