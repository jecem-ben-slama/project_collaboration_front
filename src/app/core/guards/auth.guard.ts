// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

const DEFAULT_ALLOWED_ROLES = ['ADMIN', 'EMPLOYEE'];

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles =
    (route.data?.['allowedRoles'] as string[] | undefined) ?? DEFAULT_ALLOWED_ROLES;
  if (!authService.hasRole(allowedRoles)) {
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { accessDenied: 'role', returnUrl: state.url },
    });
    return false;
  }
   if (!authService.hasRole(allowedRoles)) {
     return router.createUrlTree(['/unauthorized']);
   }

  return true;
};
