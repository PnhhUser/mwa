import { Route } from '@angular/router';
import ROUTES_PATH from '../../core/consts/route.const';
import { DashboardPage } from './dashboard.page';

export const DashboardRoute: Route[] = [
  {
    path: '',
    redirectTo: ROUTES_PATH.dashboard,
    pathMatch: 'full',
  },
  {
    path: ROUTES_PATH.dashboard,
    component: DashboardPage,
  },
];
