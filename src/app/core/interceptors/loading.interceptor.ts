import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.turnOn();

  return next(req).pipe(
    delay(1000),
    finalize(() => loaderService.turnOff()),
  );
};
