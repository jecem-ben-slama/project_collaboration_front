import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is already logged in, redirect them away from the Login page
  if (authService.isLoggedIn()) {
    const role = authService.getUserRole();

    // Redirect to their respective dashboard based on the role in localStorage
    if (role === 'ADMIN') {
      return router.createUrlTree(['/admin/dashboard']);
    } else {
      return router.createUrlTree(['/user/projects']);
    }
  }

  // If they are not logged in, allow them to view the Login page
  return true;
};
