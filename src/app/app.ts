import { Component, inject } from '@angular/core';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoaderService } from './core/services/loader.service';
import ROUTES_PATH from './core/consts/route.const';
import { DictionaryService } from './core/services/Dictionary.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule],
  templateUrl: './app.html',
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly loaderService = inject(LoaderService);

  // constructor(private dictionaryService: DictionaryService) {}

  ngOnInit() {
    this.authService.checkAuthStatus().subscribe({
      next: (isAuthenticated) => {
        const currentUrl = this.router.url;
        const isOnLoginPage = currentUrl.includes(ROUTES_PATH.login);

        if (!isAuthenticated && !isOnLoginPage) {
          this.router.navigate([`/${ROUTES_PATH.login}`]);
        }
      },
      error: () => {
        this.router.navigate([`/${ROUTES_PATH.login}`]);
      },
    });
  }
}
