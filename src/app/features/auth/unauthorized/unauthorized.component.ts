import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent {
  // Making authService public so we can use it in the HTML template
  constructor(public authService: AuthService, private router: Router) {}

  goBack(): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      // Send them back to their specific workspace
      if (role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/projects']);
      }
    } else {
      // If session expired or they aren't logged in, send to login
      this.router.navigate(['/login']);
    }
  }
}
