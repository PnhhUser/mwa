import { Route, Routes } from '@angular/router';
import ROUTES_PATH from '../../core/consts/route.const';
import { ManagePage } from './manage.page';
import BREADCRUMB from '../../core/consts/breadcrumb.const';
import { Overview } from '../../components/overview/overview.component';
import { ManageList } from '../../components/manage-list/manage-list.component';

export const ManageRoute: Routes = [
  {
    path: ROUTES_PATH.manage,
    component: ManagePage,
    data: { breadcrumb: BREADCRUMB.manage, icon: 'windows' },
    children: [
      {
        path: '',
        component: ManageList,
      },
      {
        path: ':manageId/overview',
        component: Overview,
        data: { breadcrumb: BREADCRUMB.overview },
      },
    ],
  },
];
