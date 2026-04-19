import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import ROUTES_PATH from '../consts/route.const';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated) {
    return true;
  }

  return router.createUrlTree([`/${ROUTES_PATH.login}`]);
};
