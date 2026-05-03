import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check Authentication
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Get required roles (Matches 'roles' key in AppRoutingModule)
  const requiredRoles = route.data?.['roles'] as string[];

  // 3. Check Authorization
  // We use the role stored in localStorage during login
  if (requiredRoles && !authService.hasRole(requiredRoles)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
