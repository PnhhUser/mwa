import { Routes } from '@angular/router';
import { ManageRoute } from './pages/manage/manage.route';
import { LayoutMain } from './layout/layout-main/layout-main';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LoginPage } from './pages/login/login.page';
import ROUTES_PATH from './core/consts/route.const';

export const routes: Routes = [
  {
    path: '',
    component: LayoutMain,
    canActivate: [authGuard],
    children: [{ path: '', redirectTo: ROUTES_PATH.manage, pathMatch: 'full' }, ...ManageRoute],
  },
  {
    path: ROUTES_PATH.login,
    component: LoginPage,
    canActivate: [guestGuard],
  },
];
