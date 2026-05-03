import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  constructor(private authService: AuthService, private router: Router) {}

  goBack() {
    const role = this.authService.getUserRole(); // adjust to your method
    if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
    else if (role === 'EMPLOYEE') this.router.navigate(['/user/projects']);
    else this.router.navigate(['/login']);
  }
}
