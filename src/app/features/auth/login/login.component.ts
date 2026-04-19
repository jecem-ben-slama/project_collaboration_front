import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Model for the form
  loginData = {
    email: '',
    password: '',
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar // Material feedback
  ) {}

  onLogin(): void {
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login Response JSON:', JSON.stringify(response, null, 2));
        this.isLoading = false;
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });

        const returnUrl =
          this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
        const role = response.role?.toUpperCase();

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (role === 'ADMIN' || role === 'EMPLOYEE') {
          this.router.navigate(['/projects']);
        } else {
          this.router.navigate(['/login'], {
            queryParams: { accessDenied: 'role' },
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Invalid email or password', 'Retry', {
          duration: 5000,
        });
        console.error('Login error:', err);
      },
    });
  }
}
